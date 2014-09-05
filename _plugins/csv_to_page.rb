module Jekyll
  require 'csv'

  class ZipCodePage < Page
    def initialize(site, base, zip, data)
      dir = site.config['zip_dir'] || 'zip'
      @site = site
      @base = base
      @dir = "#{dir}/#{data['zip']}/"
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'zip.html')

      self.data['data'] = {
        # From zip csv (SNAP_Particpation_and_Race_Merged.csv, SNAP_Eligibility_vs_Participation_plus_SNAP_meals.csv)
        'zip' => "#{data["zip"]}",
        'county' => data['county'],
        'totalSnapRecipients' => data['totalSnapRecipients'],
        'recipients0To17' => data['recipients0To17'],
        'recipients18To64' => data['recipients18To64'],
        'recipients65Plus' => data['recipients65Plus'],
        'totalIncomeEligibleIndividuals' => data['totalIncomeEligibleIndividuals'],
        'incomeEligible0To17' => data['incomeEligible0To17'],
        'incomeEligible18To64' => data['incomeEligible18To64'],
        'incomeEligible65Plus' => data['incomeEligible65Plus'],
        'totalIncomeEligibleButNotReceiving' => data['totalIncomeEligibleButNotReceiving'],
        'incomeEligibleButNotReceiving0To17' => data['incomeEligibleButNotReceiving0To17'],
        'incomeEligibleButNotReceiving18To64' => data['incomeEligibleButNotReceiving18To64'],
        'incomeEligibleButNotReceiving65Plus' => data['incomeEligibleButNotReceiving65Plus'],
        'recipientRaceNativeAmerican' => data['recipientRaceNativeAmerican'],
        'recipientRaceAsian' => data['recipientRaceAsian'],
        'recipientRaceBlack' => data['recipientRaceBlack'],
        'recipientRacePacificIslander' => data['recipientRacePacificIslander'],
        'recipientRaceWhite' => data['recipientRaceWhite'],
        'recipientRaceMultiRace' => data['recipientRaceMultiRace'],
        'recipientRaceUnknownMissing' => data['recipientRaceUnknownMissing'],
        'recipientEthnicityHispanic' => data['recipientEthnicityHispanic'],
        'recipientEthnicityNonHispanic' => data['recipientEthnicityNonHispanic'],
        'recipientEthnicityUnknownMissing' => data['recipientEthnicityUnknownMissing'],
        'householdIncomeWithEarnedIncome' => data['householdIncomeWithEarnedIncome'],
        'averageBenefitperMeal' => data['averageBenefitperMeal'],
        # From county csv (Food_Insecurity.csv, Food_Banks.csv)
        'individualFoodInsecurityRate' => data['individualFoodInsecurityRate'],
        'childFoodInsecurityRate' => data['childFoodInsecurityRate'],
        'weightedCostPerMeal' => data['weightedCostPerMeal'],
        'foodInsecureChildren' => data['foodInsecureChildren'],
        'costOfFoodIndex' => data['costOfFoodIndex'],
        'foodBank-name' => data['foodBank'],
        'foodBank-address' => data['address'],
        'foodBank-phone' => data['phone'],
        'foodBank-website' => data['website'],
        'latitude' => data['latitude'],
        'longitude' => data['longitude'],
        'polygonCoords' => data['polygonCoords']
      }
      # Unused data
      #'' => data['Total SNAP Households']
      #'' => data['Average Monthly SNAP Benefit per Household']
      #'' => data['Total Benefits Distributed']
      #'' => data['Total Participation Rate']
      #'' => data['Participation Rate 0-17']
      #'' => data['Participation Rate 18-64']
      #'' => data['Participation Rate 65+']
      #'' => data['Household income status with only earned']
    end
  end

  class ZipCodeGenerator < Jekyll::Generator
    safe true

    def generate(site)
      # set directory csv data will come from
      dir = site.config['csv_dir'] || '_data'
      base = File.join(site.source, dir)
      # get all csv files in data directory
      entries = Dir.chdir(base) { Dir['zip-data.csv', 'county-data.csv'] }

      # init hash to allow for one to many county => zip mappings
      county_2_zip = Hash.new
      # loop through csv files and add contents of each to hash
      csv_data = Hash.new
      entries.each do |entry|
        path = File.join(site.source, dir, entry)

        file_data = CSV.read(path, :headers => true)
        data = Hash.new
        data['keys'] = file_data.headers
        data['content'] = file_data.to_a[1..-1]

        # @todo - add switch case statement to account for each csv file
        # zip
        # county only
        # polygon data
        case entry
          when 'zip-data.csv'
            data['content'].each do |row|
              county = row[2].strip.downcase
              zip = row[0].strip
              # build hash of county => zip relationships
              if county_2_zip.has_key?(county)
                county_2_zip[county].push(zip)
              else
                county_2_zip[county] = [zip]
              end
              # append data for zip to master hash
              csv_data[zip] = Hash.new
              row.each_with_index do |item, i|
                if item
                  if data['keys'][i].strip == 'polygonCoords'
                    # break polygonCoords string into array
                    csv_data[zip][data['keys'][i].strip] = polygonCoords_to_array(item)
                  else
                    csv_data[zip][data['keys'][i].strip] = item.strip
                  end
                end
              end
            end
          when 'county-data.csv'
            data['content'].each do |row|
              county = row[0].downcase
              # get all zips for current county
              zips = county_2_zip[county]
              if zips
                # add data for county to all relevant zips
                zips.each do |zip|
                  if county_2_zip[county].include?(zip)
                    row.each_with_index do |item, i|
                      if data['keys'][i].strip == 'county'
                        next
                      end
                      csv_data[zip][data['keys'][i].strip] = item.strip
                    end
                  end
                end
              end
            end
        end
      end

      # add array of zip codes to site data for use in home page widget option list
      zips = Hash.new
      zips['zips'] = csv_data.keys
      site.data.merge!(zips)

      # generate a page for each zip code
      csv_data.each do |zip, data|
        site.pages << ZipCodePage.new(site, site.source, zip, data)
      end
    end

    def polygonCoords_to_array(item)
      item = item.gsub!("'",'')
      item = item.gsub!('[','')
      item = item.gsub!(']','')
      item = item.split(', ')
      item.each_with_index do |coordSet, i|
        item[i] = coordSet.split(',')
        # get latitude and longitude are in correct
        item[i].reverse!
      end
      return item
    end
  end
end

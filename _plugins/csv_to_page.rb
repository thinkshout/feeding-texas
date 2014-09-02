module Jekyll
  require 'csv'

  class ZipCodePage < Page
    def initialize(site, base, zip, data)
      dir = site.config['zip_dir'] || 'zip_codes'
      @site = site
      @base = base
      @dir = "#{dir}/#{data['Zip Code']}/"
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'zip.html')

      self.data['data'] = {
        # From zip csv (SNAP_Particpation_and_Race_Merged.csv, SNAP_Eligibility_vs_Participation_plus_SNAP_meals.csv)
        'zip' => "#{data["Zip Code"]}",
        'county' => data['County'],
        'postOfficeLocation' => data['Post Office Location'],
        'totalSnapRecipients' => data['Total SNAP Recipients'],
        'recipients0To17' => data['Recipients 0-17'],
        'recipients18To64' => data['Recipients 18-64'],
        'recipients65Plus' => data['Recipients 65+'],
        'totalIncomeEligibleIndividuals' => data['Total Income-Eligible Individuals'],
        'incomeEligible0To17' => data['Income-Eligible 0-17'],
        'incomeEligibleButNotReceiving18To64' => data['Income-Eligible 18-64'],
        'incomeEligible65Plus' => data['Income-Eligible 65+'],
        'totalIncomeEligibleButNotReceiving' => data['Total Income-Eligible but not Receiving'],
        'incomeEligibleButNotReceiving0To17' => data['Income-Eligible but not Receiving 0-17'],
        'incomeEligibleButNotReceiving18To64' => data['Income-Eligible but not Receiving  18-64'],
        'incomeEligibleButNotReceiving65Plus' => data['Income-Eligible but not Receiving 65+'],
        'recipientRaceNativeAmerican' => data['Recipient Race - Native American'],
        'recipientRaceAsian' => data['Recipient Race – Asian'],
        'recipientRaceBlack' => data['Recipient Race – Black'],
        'recipientRacePacificIslander' => data['Recipient Race – Pacific Islander'],
        'recipientRaceWhite' => data['Recipient Race – White'],
        'recipientRaceMultiRace' => data['Recipient Race – Multi-race'],
        'recipientRaceUnknownMissing' => data['Recipient Race – Missing'],
        'recipientEthnicityHispanic' => data['Ethnicity – Hispanic'],
        'recipientEthnicityNonHispanic' => data['Ethnicity – Non-hispanic'],
        'recipientEthnicityUnknownMissing' => data['Ethnicity – Missing'],
        'householdIncomeWithEarnedIncome' => data['Household income status with earned income'],
        'averageBenefitperMeal' => data['Average Benefit per Meal'],
        # From county csv (Food_Insecurity.csv, Food_Banks.csv)
        'weightedCostPerMeal' => data['Weighted cost per meal'],
        'foodBank-name' => data['Food Bank'],
        'foodBank-address' => data['Address'],
        'foodBank-phone' => data['Phone'],
        'foodBank-website' => data['Website']
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
      entries = Dir.chdir(base) { Dir['*.csv'] }

      # loop through csv files and add contents of each to zip hash
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
        data['content'].each do |row|
          zip = row[2].strip
          if csv_data.has_key?(zip)
            #append data to existing zip hash
            row.each_with_index do |item, i|
              csv_data[zip][data['keys'][i].strip] = item.strip
            end
          else
            #add new zip item to hash
            csv_data[zip] = Hash.new
            #append data to existing zip hash
            row.each_with_index do |item, i|
              csv_data[zip][data['keys'][i].strip] = item.strip
            end
          end
        end
      end

      # generate a page for each zip code
      csv_data.each do |zip, data|
        site.pages << ZipCodePage.new(site, site.source, zip, data)
      end
    end
  end
end

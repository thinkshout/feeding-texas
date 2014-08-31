module Jekyll
  require 'csv'

  class ZipCodePage < Page
    def initialize(site, base, dir, zip, data)
      @site = site
      @base = base
      @dir = dir
      @name = zip

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'zip.html')
      self.data['url'] = "/zipcode/" + zip

      # From zip csv
      # self.data['title'] = "#{zipcode['title']}"
      self.data['county'] = data['County']
      self.data['postOfficeLocation'] = data['Post Office Location']
      self.data['zipcode'] = data['Zip Code']
      # self.data[''] = data['Total  SNAP Households']
      # self.data[''] = data['Average Monthly SNAP Benefit per Household']
      # self.data[''] = data['Total Benefits Distributed ']
      self.data['totalSnapRecipients'] = data['Total SNAP Recipients']
      self.data['recipients0To17'] = data['Recipients 0-17']
      self.data['recipients18To64'] = data['Recipients 18-64']
      self.data['recipients65Plus'] = data['Recipients 65+']
      self.data['totalIncomeEligibleIndividuals'] = data['Total Income-Eligible Individuals']
      self.data['incomeEligible0To17'] = data['Income-Eligible 0-17']
      self.data['incomeEligibleButNotReceiving18To64'] = data['Income-Eligible 18-64']
      self.data['incomeEligible65Plus'] = data['Income-Eligible 65+']
      self.data['totalIncomeEligibleButNotReceiving'] = data['Total Income-Eligible but not Receiving ']
      self.data['incomeEligibleButNotReceiving0To17'] = data['Income-Eligible but not Receiving 0-17']
      self.data['incomeEligibleButNotReceiving18To64'] = data['Income-Eligible but not Receiving  18-64']
      self.data['incomeEligibleButNotReceiving65Plus'] = data['Income-Eligible but not Receiving 65+']
      # self.data[''] = data['Total Participation Rate']
      # self.data[''] = data['Participation Rate 0-17']
      # self.data[''] = data['Participation Rate 18-64']
      # self.data[''] = data['Participation Rate 65+']
      self.data['recipientRaceNativeAmerican'] = data['Recipient Race - Native American']
      self.data['recipientRaceAsian'] = data['Recipient Race – Asian']
      self.data['recipientRaceBlack'] = data['Recipient Race – Black']
      self.data['recipientRacePacificIslander'] = data['Recipient Race – Pacific Islander']
      self.data['recipientRaceWhite'] = data['Recipient Race – White']
      self.data['recipientRaceMultiRace'] = data['Recipient Race – Multi-race']
      self.data['recipientRaceUnknownMissing'] = data['Recipient Race – Missing']
      self.data['recipientEthnicityHispanic'] = data['Ethnicity – Hispanic']
      self.data['recipientEthnicityNonHispanic'] = data['Ethnicity – Non-hispanic']
      self.data['recipientEthnicityUnknownMissing'] = data['Ethnicity – Missing']
      self.data['householdIncomeWithEarnedIncome'] = data['Household income status with earned income']
      # self.data[''] = data['Household income status with only earned']
      self.data['averageBenefitperMeal'] = data['Average Benefit per Meal']

      # From county csv
      self.data['weightedCostPerMeal'] = data['Weighted cost per meal']
      self.data['foodBank-name'] = data['Food Bank']
      self.data['foodBank-address'] = data['Address']
      self.data['foodBank-phone'] = data['Phone']
      self.data['foodBank-website'] = data['Website']

    end
  end

  class ZipCodeGenerator < Jekyll::Generator
    safe true

    def generate(site)
      # set directory csv data will come from
      dir = site.config['csv_dir'] || 'assets/csv_data'
      base = File.join(site.source, dir)
      # return unless File.directory?(base) && (!site.safe || !File.symlink?(base))
      # get all csv files in data directory
      entries = Dir.chdir(base) { Dir['*.csv'] }
      # entries.delete_if { |e| File.directory?(File.join(base, e)) }

      # loop through csv files and add contents of each to zip hash
      csv_data = Hash.new
      entries.each do |entry|
        path = File.join(site.source, dir, entry)
        # next if File.symlink?(path) && site.safe
        key = sanitize_filename(File.basename(entry, '.*'))

        file_data = CSV.read(path, :headers => true)
        data = Hash.new
        data['keys'] = file_data.headers
        data['content'] = file_data.to_a[1..-1]

        # @todo - add switch case statement
        data['content'].each do |row|
          zip = row[2]
          if csv_data.has_key?(zip)
            #append data to existing zip hash
            row.each_with_index do |item, i|
              csv_data[zip][data['keys'][i]] = item
            end
          else
            #add new zip item to hash
            csv_data[zip] = Hash.new
            #append data to existing zip hash
            row.each_with_index do |item, i|
              csv_data[zip][data['keys'][i]] = item
            end
          end
        end
      end

      # generate a page for each zip code
      dir = site.config['zip_dir'] || 'zip_codes'
      csv_data.each do |zip, data|
        site.pages << ZipCodePage.new(site, site.source, dir, zip, data)
      end
    end

    # copied from Jekyll
    def sanitize_filename(name)
      name = name.gsub(/[^\w\s_-]+/, '')
      name = name.gsub(/(^|\b\s)\s+($|\s?\b)/, '\\1\\2')
      name = name.gsub(/\s+/, '_')
    end
  end
end
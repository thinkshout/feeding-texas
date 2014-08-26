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

      # self.data['title'] = "#{zipcode['title']}"
      self.data['county'] = data['County']
      self.data['postOfficeLocation'] = data['Post Office Location']
      self.data['zipcode'] = data['Zip Code']
    end
  end

  class ZipCodeGenerator < Jekyll::Generator
    safe true

    def generate(site)
      # set directory csv data will come from
      dir = site.config['csv_dir'] || 'assets/csv_data'
      base = File.join(site.source, dir)
      return unless File.directory?(base) && (!site.safe || !File.symlink?(base))
      # get all csv files in data directory
      entries = Dir.chdir(base) { Dir['*.csv'] }
      entries.delete_if { |e| File.directory?(File.join(base, e)) }

      # loop through csv files and add contents of each to zip hash
      csv_data = Hash.new
      entries.each do |entry|
        path = File.join(site.source, dir, entry)
        next if File.symlink?(path) && site.safe
        key = sanitize_filename(File.basename(entry, '.*'))

        file_data = CSV.read(path, :headers => true)
        data = Hash.new
        data['keys'] = file_data.headers
        data['content'] = file_data.to_a[1..-1]

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
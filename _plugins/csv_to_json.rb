# plugin to create the json data store used to populate the options of the zip code
# select element on the home page
module Jekyll
  require 'json'
  require 'csv'

  class ZipCodeJsonGenerator < Jekyll::Generator
    safe true

    def generate(site)

      dir = site.config['csv_dir'] || 'assets/csv_data'
      base = File.join(site.source, dir)
      # use SNAP_Particpation_and_Race_Merged.csv file as default reference for building list of zip codes
      filename = site.config['zip_code_ref'] || 'SNAP_Particpation_and_Race_Merged.csv'

      path = File.join(site.source, dir, filename)
      rows = CSV.read(path)
      # @todo - 3 lines (2 null and header need to be chewed off front)
      # open json data store
      File.open("assets/json/zip-codes.json", "w") do |f|
        zipcodes = Array.new
        rows.each do |row|
          # which column we use may have to be modified if the input file changes
          zipcodes.push(row[2])
        end
        f.puts JSON.pretty_generate(zipcodes)
      end
    end
  end
end
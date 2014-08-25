# plugin to create the json data store used to populate the options of the zip code
# select element on the home page

module Jekyll
  require 'csv'

  class CSVZipToOptions < Liquid::Tag

    def render(context)
      dir = context.registers[:site].config['csv_dir'] || 'assets/csv_data'
      base = File.join(context.registers[:site].source, dir)

      # use SNAP_Particpation_and_Race_Merged.csv file as default reference for building list of zip codes
      filename = context.registers[:site].config['zip_code_ref'] || 'SNAP_Particpation_and_Race_Merged.csv'

      path = File.join(context.registers[:site].source, dir, filename)
      rows = CSV.read(path)

      options = Array.new
      rows.each do |row|
        options.push("<option value='#{row[2]}.html'>#{row[2]}</option>")
      end

      options.join()
    end

  end
end

Liquid::Template.register_tag('CSVZipToOptions', Jekyll::CSVZipToOptions)

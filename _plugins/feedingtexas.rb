# Custom plugins for Feeding Texas
module Jekyll

  # plugin to create the json data store used to populate the options of the
  # zip code select element on the home page
  class CSVZipToOptions < Liquid::Tag
    require 'csv'

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

  # Generate pages from foodbanks data file.
  class FoodbankPage < Page
    def initialize(site, base, dir, location)
      @site = site
      @base = base
      @dir = dir
      @name = "#{location['permalink']}/"

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'location.html')
      self.data['url'] = "#{dir}/#{location['permalink']}/"

      self.data['title'] = "#{location['title']}"
      self.data['location'] = location
    end
  end

  class FoodbankGenerator < Jekyll::Generator
    safe true

    def generate(site)

      dir = site.config['location_dir'] || 'locations'
      site.data['foodbanks'].each do |location|
        site.pages << FoodbankPage.new(site, site.source, dir, location)
      end

    end
  end

  # Filter for division.
  module DividedBy
    def divide(nums)
      num1 = nums[0].to_f
      num2 = nums[1].to_f
      val = num1/num2
      puts val
    end
  end
end

# Register custom tags and filters.
Liquid::Template.register_tag('CSVZipToOptions', Jekyll::CSVZipToOptions)
Liquid::Template.register_filter(Jekyll::DividedBy)

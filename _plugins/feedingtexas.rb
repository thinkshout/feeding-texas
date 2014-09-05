# Custom plugins for Feeding Texas
module Jekyll

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
    def divide(num1, num2)
      val = num1.to_f/num2.to_f
      return val.round(4)
    end
  end
end

# Register custom tags and filters.
Liquid::Template.register_filter(Jekyll::DividedBy)

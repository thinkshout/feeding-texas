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

  # Filter for division.
  module Percent
    def percent(num1, num2)
      if num2 != "0"
        val = num1.to_f/num2.to_f
      else
        val = num1.to_f
      end
      val *= 100
      return val.round
    end
  end
end

Liquid::Template.register_filter(Jekyll::Percent)

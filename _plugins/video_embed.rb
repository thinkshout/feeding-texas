class Embed < Liquid::Tag

  Syntax = /^\s*([^\s]+)(\s+(\d+)\s+(\d+)\s*)?/

  def initialize(tagName, markup, tokens)
    super

    @attributes = {}

    markup.scan(Liquid::TagAttributes) do |key, value|
      @attributes[key] = value.gsub(/^'|"/, '').gsub(/'|"$/, '')
    end

    if markup =~ Syntax then
      @id = @attributes['id']
      @service = @attributes['channel']
      @width = 560
      @height = 420
    else
      raise "No YouTube ID provided in the tag"
    end
  end

  def render(context)
    case @service
      when "youtube"
        "<iframe frameborder=\"0\" width=\"#{@width}\" height=\"#{@height}\" src=\"http:\/\/www.youtube.com\/embed/#{@id}?color=white&theme=light\"><\/iframe>"
      when "facebook"
        "<iframe src=\"http:\/\/www.facebook.com/video/embed?video_id=#{@id}\" width=\"#{@width}\" height=\"#{@height}\" frameborder=\"0\"><\/iframe>"
      when "vimeo"
        "<iframe src=\"\/\/player.vimeo.com\/video\/#{@id}?badge=0\" width=\"#{@width}\" height=\"#{@height}\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen><\/iframe>"
      when "map"
        "<iframe src=\"https:\/\/www.google.com\/maps\/d\/embed?#{@id}\" width=\"#{@width}\" height=\"#{@height}\" frameborder=\"0\" style=\"border:0\" allowfullscreen><\/iframe>"
    end
  end

   Liquid::Template.register_tag "embed", self
end

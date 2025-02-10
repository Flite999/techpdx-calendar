require 'redcarpet'

module ApplicationHelper
    def format_description(string)
        sanitize((markdown(string)))
    end

    def markdown(text)
        markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, safe_links_only: true) # move initializer to be declared only once, as designed
        markdown.render(text)
    end
end

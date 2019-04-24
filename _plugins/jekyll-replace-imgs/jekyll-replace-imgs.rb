

RE_IMG     = /<img(.*?)\/>/m
RE_DATAURL = /.*src\s*=\s*["']\s*data:.*["']/
RE_IGNORE  = /(re|data)-ignore/

REPLACEMENT = '
  <hy-img root-margin="512px" %{attrs}>
    <noscript><img data-ignore %{attrs}/></noscript>
    <span class="loading" slot="loading" hidden>
      <span class="icon-cog"></span>
    </span>
  </hy-img>'

if ENV['JEKYLL_ENV'] == 'production' then
  REPLACEMENT.gsub!(/\n+/, '')
end

CONFIG_KEY = 'replace_imgs'
REPLACEMENT_KEY = 'replacement'

Jekyll::Hooks.register([:pages, :documents], :post_render) do |page|
  config ||= page.site.config
  replacement ||= (config[CONFIG_KEY] && config[CONFIG_KEY][REPLACEMENT_KEY]) ||
    REPLACEMENT

  i = 0
  page.output = page.output.gsub(RE_IMG) do |match|
    attrs = Regexp.last_match[1]

    if match.index(RE_IGNORE).nil? && match.index(RE_DATAURL).nil? then
      i += 1
      replacement % { i:i, attrs:attrs }
    else
      match
    end
  end
end

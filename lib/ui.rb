require "rubygems"

gem "wheels"
require "wheels"

Wheels::View::path << Pathname(__FILE__).dirname.expand_path + "ui/views"

require Pathname(__FILE__).dirname.expand_path + "ui/actions"
require Pathname(__FILE__).dirname.expand_path + "ui/head"
require Pathname(__FILE__).dirname.expand_path + "ui/pagination"
require Pathname(__FILE__).dirname.expand_path + "ui/badge"
require Pathname(__FILE__).dirname.expand_path + "ui/button"
require Pathname(__FILE__).dirname.expand_path + "ui/calendar"
require Pathname(__FILE__).dirname.expand_path + "ui/account_navigation"
require Pathname(__FILE__).dirname.expand_path + "ui/date_time"
require Pathname(__FILE__).dirname.expand_path + "ui/date_time_text_box"
require Pathname(__FILE__).dirname.expand_path + "ui/date"
require Pathname(__FILE__).dirname.expand_path + "ui/toolbar"
require Pathname(__FILE__).dirname.expand_path + "ui/live_search_box"
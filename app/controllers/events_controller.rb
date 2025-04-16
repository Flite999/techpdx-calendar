class EventsController < ApplicationController
  require "icalendar"
  require "open-uri"
  require "htmlentities"

  def add
    @event = Event.new
  end

  def show
    @event = Event.find(params[:id])
  end

  def import
    @event = Event.new
  end

  def import_create
    coder = HTMLEntities.new
    url = params[:url]
    ical_data = URI.open(url).read
    calendars = Icalendar::Calendar.parse(ical_data)
    puts "logging calendars array"
    puts calendars.inspect
    calendar = calendars.first

    calendar.events.each do | event |
      Event.create(
        title: event.summary,
        description: coder.decode(event.description),
        start_time: event.dtstart,
        end_time: event.dtend,
        venue_details: event.location,
        website: event.url
      )
    end

    redirect_to home_event_path, notice: "Events were successfully imported"
  end

  def feed
    events = Event.all
    calendar = Icalendar::Calendar.new
    events.each do |event|
      calendar_event = Icalendar::Event.new
      calendar_event.dtstart = event.start_time
      calendar_event.dtend = event.end_time
      calendar_event.summary = event.title
      calendar_event.description = event.description
      calendar_event.location = event.venue_details
      calendar_event.url = event.website
      calendar.add_event(calendar_event)
    end

    calendar.publish


    render plain: calendar.to_ical, content_type: "text/calendar"
  end

  def home
    @events_today = Event.grouped_by_date(:today)
    @events_tomorrow = Event.grouped_by_date(:tomorrow)
    @events_next_two_weeks = Event.grouped_by_date(:next_two_weeks)
    @popular_tags = Event.group(:tags).order("count_id DESC").limit(10).count(:id).keys
  end

  def create
    @event = Event.new(event_params)
    if @event.save
      redirect_to home_event_path, notice: "Event was successfully created."
    else
      render :add
    end
  end

  def search
    query = params[:query].to_s.strip
    if query.present?
      @events = Event.where("LOWER(title) LIKE :q OR LOWER(description) LIKE :q", q: "%#{query}%")
                   .order(:start_time)
                   .group_by { |event| event.start_time.to_date }
    else
      @events = {}
    end
    render :search
  end

  def all
    @events = Event.all.order(:start_time).group_by { |event| event.start_time.to_date }
    render :all
  end

  private

  def event_params
    params.require(:event).permit(:title, :description, :start_time, :end_time, :tags, :website, :venue_details)
  end
end

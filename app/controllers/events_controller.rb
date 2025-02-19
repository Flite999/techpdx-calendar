class EventsController < ApplicationController
  require 'icalendar'
  require 'open-uri'
  require 'htmlentities'

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
    puts 'logging calendars array'
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

    redirect_to home_event_path, notice: 'Events were successfully imported'
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

    
    render plain: calendar.to_ical, content_type: 'text/calendar'
  end

  def home
    # @events = Event.all
    @events_today = Event.where(start_time: Time.zone.now.beginning_of_day..Time.zone.now.end_of_day).order(:start_time).group_by { |event| event.start_time.to_date}
    @events_tomorrow = Event.where(start_time: Time.zone.now.tomorrow.beginning_of_day..Time.zone.now.tomorrow.end_of_day).order(:start_time).group_by { |event| event.start_time.to_date}
    @events_next_two_weeks = Event.where(start_time: Time.zone.tomorrow.end_of_day..(Time.zone.now + 2.weeks).end_of_day).order(:start_time).group_by { |event| event.start_time.to_date}
    @popular_tags = Event.group(:tags).order('count_id DESC').limit(10).count(:id).keys
  end

  def create
    @event = Event.new(event_params)
    if @event.save
      redirect_to home_event_path, notice: 'Event was successfully created.'
    else
      render :add
    end
  end

  def search
    @events = Event.where("title LIKE ?", "%#{params[:query]}%").order(:start_time).group_by { |event| event.start_time.to_date}
    render :search
  end

  def all
    @events = Event.all.order(:start_time).group_by { |event| event.start_time.to_date}
    render :all
  end

  private

  def event_params
    params.require(:event).permit(:title, :description, :start_time, :end_time, :tags, :website, :venue_details)
  end
end
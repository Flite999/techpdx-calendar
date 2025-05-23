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
    calendar = calendars.first

    calendar.events.each do |event|
      # Convert Icalendar::Values::Text to strings before saving
      summary = event.summary.to_s
      description = event.description.to_s
      location = event.location.to_s
      event_url = event.url.to_s

      unless Event.exists?(title: summary)
        Event.create(
          title: summary,
          description: coder.decode(description),
          start_time: event.dtstart,
          end_time: event.dtend,
          venue_details: location,
          website: event_url
        )
      end
    end

    redirect_to home_event_path, notice: "Events were successfully imported."
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
    if Event.exists?(title: @event.title)
      redirect_to add_event_path, alert: "An event with this title already exists."
    elsif @event.save
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

  def index
    date = params[:date]

    if date.present?
      start_of_day = DateTime.parse(date).beginning_of_day
      end_of_day = DateTime.parse(date).end_of_day

      events = Event.where("start_time <= ? AND end_time >= ?", end_of_day, start_of_day)
      render json: { events: events, hasEvents: events.any? }
    else
      render json: { error: "Invalid date parameter" }, status: :bad_request
    end
  end

  def month
    start_date = params[:start]
    end_date = params[:end]

    if start_date.present? && end_date.present?
      begin
        start_time = DateTime.parse(start_date).beginning_of_day
        end_time = DateTime.parse(end_date).end_of_day

        events = Event.where("start_time <= ? AND end_time >= ?", end_time, start_time)
        render json: { events: events }
      rescue ArgumentError
        render json: { error: "Invalid date format" }, status: :bad_request
      end
    else
      render json: { error: "Missing start or end parameters" }, status: :bad_request
    end
  end

  def day
    begin
      date = Date.parse(params[:date])
      start_of_day = date.beginning_of_day
      end_of_day = date.end_of_day

      @date = date
      @events = { date => Event.where("start_time <= ? AND end_time >= ?", end_of_day, start_of_day).order(:start_time) }

      render :day
    rescue ArgumentError
      redirect_to home_event_path, alert: "Invalid date format"
    end
  end

  private

  def event_params
    params.require(:event).permit(:title, :description, :start_time, :end_time, :tags, :website, :venue_details)
  end
end

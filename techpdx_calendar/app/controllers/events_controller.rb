class EventsController < ApplicationController
  def add
    @event = Event.new
  end

  def import
    @event = Event.new
  end

  def home
    # @events = Event.all
    @events_today = Event.where(start_time: Time.zone.now.beginning_of_day..Time.zone.now.end_of_day)
    @events_tomorrow = Event.where(start_time: Time.zone.now.tomorrow.beginning_of_day..Time.zone.now.tomorrow.end_of_day)
    @events_next_two_weeks = Event.where(start_time: Time.zone.now.beginning_of_day..(Time.zone.now + 2.weeks).end_of_day)
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
    @events = Event.where("title LIKE ?", "%#{params[:query]}%")
    render :search
  end

  private

  def event_params
    params.require(:event).permit(:title, :description, :start_time, :end_time, :tags, :google_map_link, :website, :venue_details)
  end
end
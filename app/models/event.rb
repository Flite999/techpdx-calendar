class Event < ApplicationRecord
    validates :title, presence: true, uniqueness: { case_sensitive: false, message: "An event with this title already exists." }
    validates :start_time, presence: true
    validates :end_time, presence: true

    scope :today, -> { where(start_time: Time.zone.now.beginning_of_day..Time.zone.now.end_of_day).order(:start_time) }
    scope :tomorrow, -> { where(start_time: Time.zone.now.tomorrow.beginning_of_day..Time.zone.now.tomorrow.end_of_day).order(:start_time) }
    scope :next_two_weeks, -> { where(start_time: Time.zone.tomorrow.end_of_day..(Time.zone.now + 2.weeks).end_of_day).order(:start_time) }

    def self.grouped_by_date(scope_name)
        public_send(scope_name).group_by { |event| event.start_time.to_date }
    end
end

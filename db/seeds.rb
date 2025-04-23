# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

require 'faker'

2.times do
    start_time = Faker::Time.between(from: DateTime.now.beginning_of_day, to: DateTime.now.end_of_day - 2.hours)
    end_time = Faker::Time.between(from: start_time, to: DateTime.now.end_of_day)
    Event.create!(
        title: Faker::Lorem.sentence,
        start_time: start_time,
        end_time: end_time,
        website: Faker::Internet.url,
        description: Faker::Lorem.paragraph,
        venue_details: Faker::Address.full_address
    )
end
2.times do
    start_time = Faker::Time.forward(days: 1, period: :morning)
    end_time = Faker::Time.between(from: start_time, to: start_time + 8.hours)
    Event.create!(
        title: Faker::Lorem.sentence,
        start_time: start_time,
        end_time: end_time,
        website: Faker::Internet.url,
        description: Faker::Lorem.paragraph,
        venue_details: Faker::Address.full_address
    )
end
2.times do
    start_time = Faker::Time.forward(days: 5, period: :morning)
    end_time = Faker::Time.between(from: start_time, to: start_time + 8.hours)
    Event.create!(
        title: Faker::Lorem.sentence,
        start_time: start_time,
        end_time: end_time,
        website: Faker::Internet.url,
        description: Faker::Lorem.paragraph,
        venue_details: Faker::Address.full_address
    )
end
2.times do
    start_time = Faker::Time.forward(days: 12, period: :morning)
    end_time = Faker::Time.between(from: start_time, to: start_time + 8.hours)
    Event.create!(
        title: Faker::Lorem.sentence,
        start_time: start_time,
        end_time: end_time,
        website: Faker::Internet.url,
        description: Faker::Lorem.paragraph,
        venue_details: Faker::Address.full_address
    )
end

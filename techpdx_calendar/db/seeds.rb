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

if Rails.env.development? || Rails.env.test?
    2.times do
        Event.create!(
            title: Faker::Lorem.sentence,
            start_time: Faker::Time.between(from: DateTime.now.beginning_of_day, to: DateTime.now.end_of_day),
            end_time: Faker::Time.between(from: DateTime.now.beginning_of_day, to: DateTime.now.end_of_day),
            google_map_link: Faker::Internet.url,
            website: Faker::Internet.url,
            description: Faker::Lorem.paragraph,
            venue_details: Faker::Address.full_address,
            tags: Faker::Lorem.words(number: 4).join(", ")
        )
    end
    2.times do
        Event.create!(
            title: Faker::Lorem.sentence,
            start_time: Faker::Time.forward(days: 1, period: :morning),
            end_time: Faker::Time.forward(days: 1, period: :evening),
            google_map_link: Faker::Internet.url,
            website: Faker::Internet.url,
            description: Faker::Lorem.paragraph,
            venue_details: Faker::Address.full_address,
            tags: Faker::Lorem.words(number: 4).join(", ")
        )
    end
    2.times do
        Event.create!(
            title: Faker::Lorem.sentence,
            start_time: Faker::Time.forward(days: 5, period: :morning),
            end_time: Faker::Time.forward(days: 5, period: :evening),
            google_map_link: Faker::Internet.url,
            website: Faker::Internet.url,
            description: Faker::Lorem.paragraph,
            venue_details: Faker::Address.full_address,
            tags: Faker::Lorem.words(number: 4).join(", ")
        )
    end
    2.times do
        Event.create!(
            title: Faker::Lorem.sentence,
            start_time: Faker::Time.forward(days: 12, period: :morning),
            end_time: Faker::Time.forward(days: 12, period: :evening),
            google_map_link: Faker::Internet.url,
            website: Faker::Internet.url,
            description: Faker::Lorem.paragraph,
            venue_details: Faker::Address.full_address,
            tags: Faker::Lorem.words(number: 4).join(", ")
        )
    end
end
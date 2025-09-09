Rails.application.routes.draw do
  root "events#home"
  get "events/home", as: :home_event
  get "events/add", as: :add_event
  post "create_event", to: "events#create"
  get "events/import", to: "events#import", as: :import_events
  post "events/import", to: "events#import_create"
  get "events/search", to: "events#search", as: :search_events
  get "events/feed", to: "events#feed", as: :events_feed
  get "events/all", to: "events#all", as: :all_events
  get "events/month", to: "events#month", as: :events_month
  get "events/day/:date", to: "events#day", as: :day_events
  resources :events
  get "events/:id", to: "events#show", as: :event_detail

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end

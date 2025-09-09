class AddDetailsToEvents < ActiveRecord::Migration[8.0]
  def change
    add_column :events, :title, :string
    add_column :events, :start_time, :datetime
    add_column :events, :end_time, :datetime
    add_column :events, :google_map_link, :string
    add_column :events, :website, :string
    add_column :events, :description, :text
    add_column :events, :venue_details, :text
    add_column :events, :tags, :string
  end
end

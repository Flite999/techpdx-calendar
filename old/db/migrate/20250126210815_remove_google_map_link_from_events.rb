class RemoveGoogleMapLinkFromEvents < ActiveRecord::Migration[8.0]
  def change
    remove_column :events, :google_map_link, :string
  end
end

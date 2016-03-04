class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :provider
      t.string :uid
      t.string :name
      t.string :oauth_token
      t.datetime :oauth_expires_at
      t.datetime :created_at
      t.datetime :updated_at
      t.string :image
      t.string :location

      t.timestamps null: false
    end
  end
end

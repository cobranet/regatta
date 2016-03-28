class GamesController < ApplicationController
  def index
  end
  def save
    game = Game.find(params[:id].to_i)
    if game
      game.game = params[:data]
    else
      game = Game.new
      game.id = params[:id].to_i
      game.game = params[:data]
    end
    game.save!
  end
  def show
  end
end

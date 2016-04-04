class GamesController < ApplicationController
  def index
  end
  def save
    game = Game.find(params[:id].to_i)
    game.game = params[:game]
    game.save!
    render :json => { game: game.id }
  end
  def load
    game = Game.find(params[:id].to_i)
    render :json => { game: game.game }
  end
  def new
    game = Game.new
    game.save!
    redirect_to game_path(game.id)
  end
  def show
    @game = Game.where("id = ? " , params[:id].to_i).first_or_create
  end
end

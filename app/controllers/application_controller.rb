class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
   def current_user
     @current_user ||= User.find(session[:user_id]) if session[:user_id]
     @current_user = User.find(1)
#     if request.env['HTTP_USER_AGENT'].include?("Firefox")
#       @current_user = User.find(1)
#     else
#       @current_user = User.find(3)
#     end

  end
  helper_method :current_user
  protect_from_forgery with: :exception
end

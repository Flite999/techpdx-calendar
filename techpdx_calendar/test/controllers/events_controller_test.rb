require "test_helper"

class EventsControllerTest < ActionDispatch::IntegrationTest
  test "should get add" do
    get events_add_url
    assert_response :success
  end

  test "should get import" do
    get events_import_url
    assert_response :success
  end

  test "should get home" do
    get events_home_url
    assert_response :success
  end
end

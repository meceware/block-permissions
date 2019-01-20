<?php

class McwBPUsersController extends WP_REST_Controller {
  private $tag;

  public function __construct( $ns, $tag ) {
		$this->namespace = $ns;
		$this->rest_base = '/users';

		// Register routes
    $this->register_routes();
  }

  public function register_routes() {
    register_rest_route(
			$this->namespace,
			$this->rest_base,
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_items' ),
        'permission_callback' => array( $this, 'get_items_permissions_check' ),
			)
		);
  }

  public function get_items_permissions_check( $request ) {
    if ( ! current_user_can( 'edit_posts' ) ) {
      return new WP_Error( 'mcw_bp_gutenberg_cannot_read', esc_html( __( 'Sorry, you do not have the necessary privilege to complete the task.', $this->tag ) ), array(
        'status' => rest_authorization_required_code(),
      ) );
    }
    return true;
  }

  // Called by user_search_columns filter
  public function on_search_columns($search_columns) {
    $search_columns[] = 'display_name';
    return $search_columns;
  }

  public function get_items( $request ) {
    $params = $request->get_params();

    $search_string='';
    if (isset($params) && !empty($params) && is_array($params) ) {
      $search_string = $params['user'];
    }

    // Add filter for display_name search column
    add_filter('user_search_columns', array($this, 'on_search_columns'));

    // Create user query
    $users = new WP_User_Query( array(
      'search' => '*'.esc_attr($search_string).'*',
      'search_columns' => array('user_login', 'user_nicename', 'user_email', 'display_name'),
    ) );
    // Get user query results
    $users_found = $users->get_results();

    // Output array
    $data = array();

    if ( isset($users_found) && is_array($users_found) ){
      foreach ($users_found as $user){
        if (isset($user->data)){
          $data[] = $this->prepare_response_for_collection( array(
            'value' => $user->data->ID,
            'label' => $user->data->display_name,
          ) );
        }
      }
    }

		// Return data array
		return rest_ensure_response( $data );
	}
}

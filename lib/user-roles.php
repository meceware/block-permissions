<?php

class McwBPUserRolesController extends WP_REST_Controller {
  private $tag;

  public function __construct( $ns, $tag ) {
		$this->namespace = $ns;
		$this->rest_base = '/user-roles';

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
      return new WP_Error( 'mcw_bp_gutenberg_cannot_read', esc_html ( __( 'Sorry, you do not have the necessary privilege to complete the task.', $this->tag ) ), array(
        'status' => rest_authorization_required_code(),
      ) );
    }
    return true;
  }

  public function get_items( $request ) {
		// WordPress roles
		global $wp_roles;

		// Check if WordPress roles are set
		if ( !isset( $wp_roles ) ){
			$wp_roles = new WP_Roles();
		}

		// Get role names
		$user_roles = $wp_roles->get_names();

		// Output array
		$data = array();
		// Fill the output data
		foreach ( $user_roles as $key => $value ) {
			$data[] = $this->prepare_response_for_collection( array(
				'value' => $key,
				'label' => $value,
			) );
		}

		// Return data array
		return rest_ensure_response( $data );
	}
}

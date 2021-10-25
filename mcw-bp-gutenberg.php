<?php
/**
 * Plugin Name: Block Permissions
 * Plugin URI: https://www.meceware.com/docs/block-permissions-for-gutenberg/
 * Description: Show or hide Gutenberg content blocks depending on their user attributes such as user role, log in information, user names, devices, date/time, day of week and custom functionality.
 * Author: Mehmet Celik
 * Author URI: https://www.meceware.com/
 * Version: 1.0.8
 * Text Domain: mcw_bp_gutenberg
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if (!class_exists('McwBPUserRolesController')) {
require_once dirname( __FILE__ ) . '/lib/user-roles.php';
}

if (!class_exists('McwBPUsersController')) {
require_once dirname( __FILE__ ) . '/lib/users.php';
}

// Add mobile detect plugin
if (!class_exists('Mobile_Detect_BP')) {
  require_once( plugin_dir_path(__FILE__) . '/lib/mobile_detect/Mobile_Detect.php' );
}

class McwBPGutenberg {
	// Plugin version
	private $version = '1.0.8';
	// Shortcode name tag
	private $tag = 'mcw-bp-gutenberg';
	// Namespace
	private $ns = 'meceware/block-permissions';
	private $nsRestBase = 'v1';

	// Mobile detect
	protected $detect = null;

	// Constructor
	public function __construct() {
		add_action( 'init', array( $this, 'on_init' ) );

		add_action( 'enqueue_block_editor_assets', array( $this, 'on_enqueue_block_editor_assets' ) );
	}

	// Returns the user role of current user
	private function getLoggedUserRole() {
		// Current user data
		$current_user = wp_get_current_user();
		// Check
		if ( is_array($current_user->roles) && !empty( $current_user->roles ) ) {
			return $current_user->roles;
		} else {
			return false;
		}
	}

	private function isShortcodeFiltered($atts) {
		// Check if everyone is selected
		if ( !isset($atts['showORhidePermission']) )
			return true;

		if ( empty($atts['showORhidePermission']) )
			return true;

		if ( $atts['showORhidePermission'] == 'members' ) {
			// Return true if user is logged in
			return is_user_logged_in();
		}

		else if ( $atts['showORhidePermission'] == 'selected_user_roles' ) {
			if ( !is_user_logged_in() ) {
				return null;
			}

			if ( isset( $atts['userRoles'] ) ) {
				// Get user role
				$userActiveRoles = $this->getLoggedUserRole();
				$userDecodedRoles = json_decode( $atts['userRoles'] );
				$userRoles = array();
				foreach ( $userDecodedRoles as $role ) {
					$userRoles[] = $role->value;
				}

				if ( is_array( $userActiveRoles ) && isset( $userRoles ) && !empty( $userRoles ) ) {
					foreach ($userActiveRoles as $role) {
						if ( isset($role) && !empty($role) && in_array($role, $userRoles) ) {
							return true;
						}
					}
				}
			}

			// User is not logged in or no user role is selected, or role not found
			// return false
		}

		else if ( $atts['showORhidePermission'] == 'selected_users' ) {
			if ( !is_user_logged_in() )
				return;

			if ( isset($atts['users']) ) {
				$current_user_id = get_current_user_id();
				$selectedUsers = json_decode($atts['users'], true);
				$userIds = [];
				foreach ($selectedUsers as $selectedUser) {
					$userIds[] = $selectedUser['value'];
				}
				if ( !empty($userIds) && in_array($current_user_id, $userIds) ) {
					// User is in the selected users list
					return true;
				}
			}

			// If no user is selected, return false
		}

		else if ($atts['showORhidePermission'] == 'selected_devices') {
			if ( isset($atts['devices']) && !empty($atts['devices']) ) {
				$selectedDevices = json_decode($atts['devices']);

				// If there is a JSON error, do not hide
				if ( json_last_error() !== JSON_ERROR_NONE ) {
					return true;
				}

				// Create mobile detect
				if ($this->detect === null) {
					$this->detect = new Mobile_Detect_BP();
				}

				if ( $selectedDevices->tablets && ($this->detect->isTablet()) ) {
					return true;
				}

				if ( $selectedDevices->phones && ($this->detect->isMobile() && !$this->detect->istablet()) ) {
					return true;
				}

				if ( $selectedDevices->desktops && ( !$this->detect->isMobile() && !$this->detect->istablet() ) ) {
					return true;
				}

				return false;
			}

			return true;
		}

		else if ($atts['showORhidePermission'] == 'date_range') {
			if ( isset($atts['dateRange']) && !empty($atts['dateRange']) ) {
				$dateNow = new DateTime("now");
				// TODO: timezones can be added.
				// $dateNow = new DateTime("now", new DateTimeZone("+0200"));

				$selectedDates = json_decode($atts['dateRange']);
				$dateStart = DateTime::createFromFormat("Y/m/d G:i", $selectedDates->start);
				$dateEnd = DateTime::createFromFormat("Y/m/d G:i", $selectedDates->end);

				return ( ($dateNow < $dateEnd) && ($dateNow > $dateStart) );
			}

			// Otherwise, show the content
			return true;
		}

		else if ($atts['showORhidePermission'] == 'time_range') {
			if ( isset($atts['timeRange']) && !empty($atts['timeRange']) ) {
				$timeNow = new DateTime("now");

				$selectedTimes = json_decode($atts['timeRange']);
				$startTime = DateTime::createFromFormat("G:i", $selectedTimes->start);
				$endTime = DateTime::createFromFormat("G:i", $selectedTimes->end);

				if ($endTime <= $startTime) {
					$endTime->add( DateInterval::createFromDateString('1 day') );
				}

				return ( ($timeNow < $endTime) && ($timeNow > $startTime) );
			}

			return true;
		}

		else if ($atts['showORhidePermission'] == 'day_of_week') {
			if ( isset($atts['dayOfWeek']) && !empty($atts['dayOfWeek']) ) {
				$dayOfWeekNow = date('w');

				$dayOfWeekSelected = json_decode($atts['dayOfWeek']);
				$dayOfWeeks = [];
				foreach ($dayOfWeekSelected as $dow) {
					$dayOfWeeks[] = $dow->value;
				}

				if ( !empty($dayOfWeeks) && in_array($dayOfWeekNow, $dayOfWeeks) ) {
					// User is in the selected users list
					return true;
				}
			}

			// If no days are selected, remove the content
		}

		else if ($atts['showORhidePermission'] == 'php_function') {
			if (isset($atts['phpFunc'])) {
				if (function_exists($atts['phpFunc'])) {
					return call_user_func($atts['phpFunc']);
				}
			}

			return true;
		}

		return false;
	}

	public function on_init() {
		// Check if the register function exists
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		// Register the sharing block
		register_block_type(
			$this->ns, array(
				'render_callback' => array( $this, 'on_render_callback' ),
			)
		);

		add_action( 'rest_api_init', array( $this, 'on_rest_api_init' ) );
	}

	// Enqueue Gutenberg block assets for backend editor.
	public function on_enqueue_block_editor_assets() {
		wp_enqueue_script(
			$this->tag . '-block-js',
			plugins_url( 'dist/blocks.build.js', __FILE__ ),
			array( 'wp-blocks', 'wp-i18n', 'wp-element' ),
			$this->version,
			true
		);

		wp_enqueue_style(
			$this->tag . '-block-editor-css',
			plugins_url( 'dist/blocks.editor.build.css', __FILE__ ),
			array( 'wp-edit-blocks' ),
			$this->version,
			'all'
		);

		wp_enqueue_style(
			$this->tag . '-picker-css',
			plugins_url( 'dist/picker.min.css', __FILE__ ),
			array( 'wp-edit-blocks' ),
			$this->version,
			'all'
		);
	}

	// Check if the content is shown
	public function on_render_callback( $atts, $content ) {
		// Select show or hide
		$show = !( isset($atts['showORhide']) && !empty( $atts['showORhide']) );
		$result = $this->isShortcodeFiltered($atts);

		if ( $result === null ) {
			return '';
		}

		if ( $show ^ $result ) {
			return '';
		}

		return $content;
	}

	public function on_rest_api_init() {
		// Initialize user roles controller
		new McwBPUserRolesController(
			$this->ns . '/' . $this->nsRestBase,
			$this->tag
		);

		// Initialize users controller
		new McwBPUsersController(
			$this->ns . '/' . $this->nsRestBase,
			$this->tag
		);
	}
}

new McwBPGutenberg();

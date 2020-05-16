/**
 * BLOCK: mcw-bp-gutenberg
 */

//  Import CSS.
import './editor.scss';

/* Import attributes */
import attributes from './attributes';
/* Import classnames */
import classnames from 'classnames';
/* moment library http://momentjs.com/ */
import moment from 'moment';
/* RC Date Time Picker by https://allenwooooo.github.io/rc-datetime-picker/ */
import { DatetimePickerTrigger } from 'rc-datetime-picker';
/* React select https://react-select.com/ */
import MultiSelect from 'react-select';

import UserRoleSelect from './components/user-role';
import UsersSelect from './components/users';

import { WpEditor } from '../compatibility';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

const {
  Fragment,
} = wp.element;

const {
  InnerBlocks,
  InspectorControls,
} = WpEditor;

const {
  PanelBody,
  TextControl,
  SelectControl,
  ToggleControl,
  Tooltip,
  BaseControl,
} = wp.components;

// Block icon
const permissionIcon = <svg xmlns = 'http://www.w3.org/2000/svg' width = '24' height = '24' viewBox = '0 0 24 24'>
  <path d = 'M12 2.544c2.5 1.806 4.554 2.292 7 2.416v9.575c0 3.042-1.687 3.826-7 7.107-5.31-3.277-7-4.064-7-7.107v-9.575c2.446-.124 4.5-.61 7-2.416zm0-2.544c-3.371 2.866-5.484 3-9 3v11.535c0 4.603 3.203 5.804 9 9.465 5.797-3.661 9-4.862 9-9.465v-11.535c-3.516 0-5.629-.134-9-3zm-1 7h2v6h-2v-6zm1 9c-.553 0-1-.447-1-1s.447-1 1-1 1 .447 1 1-.447 1-1 1z' fill = '#ff0000' />
</svg>;

// Register Block Permissions block
registerBlockType( 'meceware/block-permissions', {
  // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
  title: __( 'Block Permissions', 'mcw-bp-gutenberg' ),
  description: __( 'Show or hide Gutenberg content blocks depending on their attributes.', 'mcw-bp-gutenberg' ),
  icon: permissionIcon,
  category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
  keywords: [
    __( 'Block Permissions', 'mcw-bp-gutenberg' ),
    __( 'Permission', 'mcw-bp-gutenberg' ),
    __( 'meceware', 'mcw-bp-gutenberg' ),
  ],
  attributes,
  supports: {
    customClassName: false,
    anchor: false,
    alignWide: false,
    className: false,
  },

  edit: props => {
    const { attributes: { showORhide, showORhidePermission, userRoles, users, devices, dateRange, timeRange, dayOfWeek, phpFunc, containerTag, containerClass }, setAttributes } = props;
    const timeFormat = 'HH:mm';
    const dateTimeEditFormat = 'DD MMM YYYY ' + timeFormat;
    const dateTimeSaveFormat = 'YYYY/MM/DD ' + timeFormat;

    const devicesDecoded = JSON.parse( devices );
    const dateRangeDecoded = JSON.parse( dateRange );
    const timeRangeDecoded = JSON.parse( timeRange );
    let daysOfWeekDecoded = [];
    if ( null !== dayOfWeek && dayOfWeek ) {
      daysOfWeekDecoded = JSON.parse( dayOfWeek );
    }

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody
            title = { __( 'Permissions', 'mcw-bp-gutenberg' ) }
            initialOpen = { true }
          >
            <SelectControl
              label = { __( 'Choose the block permission', 'mcw-bp-gutenberg' ) }
              value = { showORhide }
              options = { [
                { value: '', label: __( 'Show', 'mcw-bp-gutenberg' ) },
                { value: 'hide', label: __( 'Hide', 'mcw-bp-gutenberg' ) },
              ] }
              onChange = { value => setAttributes( { showORhide: value } ) }
            />
            <SelectControl
              label = { __( 'The Content For', 'mcw-bp-gutenberg' ) }
              value = { showORhidePermission }
              options = { [
                { value: '', label: __( 'Everyone', 'mcw-bp-gutenberg' ) },
                { value: 'members', label: __( 'Members', 'mcw-bp-gutenberg' ) },
                { value: 'selected_user_roles', label: __( 'Members with Selected User Roles', 'mcw-bp-gutenberg' ) },
                { value: 'selected_users', label: __( 'Selected Users', 'mcw-bp-gutenberg' ) },
                { value: 'selected_devices', label: __( 'Selected Devices', 'mcw-bp-gutenberg' ) },
                { value: 'date_range', label: __( 'Date Range', 'mcw-bp-gutenberg' ) },
                { value: 'time_range', label: __( 'Time Range', 'mcw-bp-gutenberg' ) },
                { value: 'day_of_week', label: __( 'Day Of Week', 'mcw-bp-gutenberg' ) },
                { value: 'php_function', label: __( 'PHP Function', 'mcw-bp-gutenberg' ) },
              ] }
              onChange = { value => setAttributes( { showORhidePermission: value } ) }
            />

            { ( showORhidePermission && showORhidePermission === 'selected_user_roles' ) && (
              <UserRoleSelect
                className = 'mcw-bp-gutenberg-user-roles'
                name = 'mcw-bp-gutenberg-user-roles'
                selected = { userRoles }
                onChange = { value => setAttributes( { userRoles: JSON.stringify( value ) } ) }
              />
            ) }

            { ( showORhidePermission && showORhidePermission === 'selected_users' ) && (
              <UsersSelect
                className = 'mcw-bp-gutenberg-users'
                name = 'mcw-bp-gutenberg-users'
                selected = { users }
                onChange = { value => setAttributes( { users: JSON.stringify( value ) } ) }
              />
            ) }

            { ( showORhidePermission && showORhidePermission === 'selected_devices' ) && (
              <BaseControl>
                <ToggleControl
                  label = 'Desktops'
                  checked = { devicesDecoded.desktops }
                  onChange = { ( checked ) => {
                    devicesDecoded.desktops = checked;
                    setAttributes( { devices: JSON.stringify( devicesDecoded ) } );
                  } }
                />
                <ToggleControl
                  label = 'Tablets'
                  checked = { devicesDecoded.tablets }
                  onChange = { ( checked ) => {
                    devicesDecoded.tablets = checked;
                    setAttributes( { devices: JSON.stringify( devicesDecoded ) } );
                  } }
                />
                <ToggleControl
                  label = 'Phones'
                  checked = { devicesDecoded.phones }
                  onChange = { ( checked ) => {
                    devicesDecoded.phones = checked;
                    setAttributes( { devices: JSON.stringify( devicesDecoded ) } );
                  } }
                />
              </BaseControl>
            ) }

            { ( showORhidePermission && showORhidePermission === 'date_range' ) && (
              <BaseControl>
                <Tooltip
                  text = { __( 'Specify the start date and time that the content will be given permission.', 'mcw-bp-gutenberg' ) }
                >
                  <label>
                    <div className = 'wp-block-mcw-bp-guten-title'>
                      { __( 'Start Date', 'mcw-bp-gutenberg' ) }
                    </div>
                    <DatetimePickerTrigger
                      className = ''
                      closeOnSelectDay = { false }
                      moment = { moment( dateRangeDecoded.start, dateTimeSaveFormat ) }
                      onChange = { datetime => {
                        dateRangeDecoded.start = datetime.format( dateTimeSaveFormat );
                        setAttributes( { dateRange: JSON.stringify( dateRangeDecoded ) } );
                      } }
                    >
                      <input type = 'text' value = { moment( dateRangeDecoded.start, dateTimeSaveFormat ).format( dateTimeEditFormat ) } />
                    </DatetimePickerTrigger>
                  </label>
                </Tooltip>

                <Tooltip
                  text = { __( 'Specify the end date and time that the content will be given permission.', 'mcw-bp-gutenberg' ) }
                >
                  <label>
                    <div className = 'wp-block-mcw-bp-guten-title'>
                      { __( 'End Date', 'mcw-bp-gutenberg' ) }
                    </div>
                    <DatetimePickerTrigger
                      className = ''
                      closeOnSelectDay = { false }
                      moment = { moment( dateRangeDecoded.end, dateTimeSaveFormat ) }
                      onChange = { datetime => {
                        dateRangeDecoded.end = datetime.format( dateTimeSaveFormat );
                        setAttributes( { dateRange: JSON.stringify( dateRangeDecoded ) } );
                      } }
                    >
                      <input type = 'text' value = { moment( dateRangeDecoded.end, dateTimeSaveFormat ).format( dateTimeEditFormat ) } />
                    </DatetimePickerTrigger>
                  </label>
                </Tooltip>
              </BaseControl>
            ) }

            { ( showORhidePermission && showORhidePermission === 'time_range' ) && (
              <BaseControl>
                <Tooltip
                  text = { __( 'Specify the start time that the content will be given permission.', 'mcw-bp-gutenberg' ) }
                >
                  <label>
                    <div className = 'wp-block-mcw-bp-guten-title'>
                      { __( 'Start Time', 'mcw-bp-gutenberg' ) }
                    </div>
                    <DatetimePickerTrigger
                      className = ''
                      showCalendarPicker = { false }
                      moment = { moment( timeRangeDecoded.start, timeFormat ) }
                      onChange = { time => {
                        timeRangeDecoded.start = time.format( timeFormat );
                        setAttributes( { timeRange: JSON.stringify( timeRangeDecoded ) } );
                      } }
                    >
                      <input type = 'text' value = { moment( timeRangeDecoded.start, timeFormat ).format( timeFormat ) } />
                    </DatetimePickerTrigger>
                  </label>
                </Tooltip>

                <Tooltip
                  text = { __( 'Specify the end time that the content will be given permission.', 'mcw-bp-gutenberg' ) }
                >
                  <label>
                    <div className = 'wp-block-mcw-bp-guten-title'>
                      { __( 'End Time', 'mcw-bp-gutenberg' ) }
                    </div>
                    <DatetimePickerTrigger
                      className = ''
                      showCalendarPicker = { false }
                      moment = { moment( timeRangeDecoded.end, timeFormat ) }
                      onChange = { time => {
                        timeRangeDecoded.end = time.format( timeFormat );
                        setAttributes( { timeRange: JSON.stringify( timeRangeDecoded ) } );
                      } }
                    >
                      <input type = 'text' value = { moment( timeRangeDecoded.end, timeFormat ).format( timeFormat ) } />
                    </DatetimePickerTrigger>
                  </label>
                </Tooltip>
              </BaseControl>
            ) }

            { ( showORhidePermission && showORhidePermission === 'day_of_week' ) && (
              <BaseControl>
                <label>
                  <MultiSelect
                    defaultValue = { daysOfWeekDecoded }
                    isMulti
                    name = 'mcw-bp-gutenberg-day-of-week'
                    options = { [
                      { value: '0', label: __( 'Sunday', 'mcw-bp-gutenberg' ) },
                      { value: '1', label: __( 'Monday', 'mcw-bp-gutenberg' ) },
                      { value: '2', label: __( 'Tuesday', 'mcw-bp-gutenberg' ) },
                      { value: '3', label: __( 'Wednesday', 'mcw-bp-gutenberg' ) },
                      { value: '4', label: __( 'Thursday', 'mcw-bp-gutenberg' ) },
                      { value: '5', label: __( 'Friday', 'mcw-bp-gutenberg' ) },
                      { value: '6', label: __( 'Saturday', 'mcw-bp-gutenberg' ) },
                    ] }
                    className = ''
                    onChange = { value => setAttributes( { dayOfWeek: JSON.stringify( value ) } ) }
                  />
                  { __( 'Choose the day of weeks you want the content is given permission to be visible.', 'mcw-bp-gutenberg' ) }
                </label>
              </BaseControl>
            ) }

            { ( showORhidePermission && showORhidePermission === 'php_function' ) && (
              <BaseControl>
                <label>
                  <TextControl
                    label = 'PHP Function Name'
                    value = { phpFunc }
                    onChange = { ( text ) => setAttributes( { phpFunc: text } ) }
                  />
                  { __( 'Enter the PHP function name that suggests whether content permission is given. (Return true if the element will be shown when content permission is Show.)', 'mcw-bp-gutenberg' ) }
                </label>
              </BaseControl>
            ) }

          </PanelBody>
          <PanelBody
            title = { __( 'Container', 'mcw-bp-gutenberg' ) }
            initialOpen = { false }
          >
            <SelectControl
              label = { __( 'HTML tag', 'mcw-bp-gutenberg' ) }
              value = { containerTag }
              options = { [
                { value: '', label: __( 'None', 'mcw-bp-gutenberg' ) },
                { value: 'div', label: __( 'div', 'mcw-bp-gutenberg' ) },
                { value: 'section', label: __( 'section', 'mcw-bp-gutenberg' ) },
                { value: 'article', label: __( 'article', 'mcw-bp-gutenberg' ) },
                { value: 'main', label: __( 'main', 'mcw-bp-gutenberg' ) },
                { value: 'aside', label: __( 'aside', 'mcw-bp-gutenberg' ) },
              ] }
              onChange = { value => setAttributes( { containerTag: value } ) }
            />
            { containerTag && (
              <TextControl
                label = { __( 'Class Names', 'mcw-bp-gutenberg' ) }
                value = { containerClass }
                onChange = { value => setAttributes( { containerClass: value } ) }
              />
            ) }
          </PanelBody>
        </InspectorControls>

        <Fragment>
          <div className = 'wp-block-mcw-bp-guten-innerblock'>
            <InnerBlocks templateLock = { false } />
          </div>
          <div className = { 'wp-block-mcw-bp-guten-innerblock wp-block-mcw-bp-guten-desc' }>
            { __( 'Add your content and set the permission parameters.', 'mcw-bp-gutenberg' ) }
          </div>
        </Fragment>
      </Fragment>
    );
  },

  save: props => {
    const { attributes: { containerTag, containerClass } } = props;

    const HtmlTagOut = containerTag.trim();
    const classes = classnames( containerClass.trim() );

    if ( HtmlTagOut && '' !== HtmlTagOut && 'none' !== HtmlTagOut ) {
      return (
        <HtmlTagOut className = { classes }>
          <InnerBlocks.Content />
        </HtmlTagOut>
      );
    }

    return (
      <InnerBlocks.Content />
    );
  },
} );

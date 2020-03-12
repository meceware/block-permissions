# Block Permissions

Show Gutenberg blocks only to target audience depending on their user attributes such as user role, log in information and user names.

For documentation, please check:

https://www.meceware.com/docs/block-permissions-for-gutenberg/

## How To Use:
* Activate 'Block Permissions' plugin.
* Edit any page with Gutenberg editor.
* If Block Permission is chosen for 'Show', the block content will be shown if the settings are validated. Otherwise block content will be hidden.

### Show

* If 'Everyone' is selected as the permission, the block content will be shown for everyone.

* If 'Members' is selected as the permission, the block content will be shown for the logged in users.

* If 'Members with Selected User Roles' is selected as the permission, the block content will be shown only for the members with specified user roles.

* If 'Selected Users' is selected as the permission, the block content will be shown only to the specified users.

* If 'Selected Devices' is selected as the permission, the block content will be shown for the specified devices, such as Desktops, Phones and/or Tablets.

* If 'Date Range' is selected as the permission, the block content will be shown between the specified dates.

* If 'Time Range' is selected as the permission, the block content will be shown between the specified times.

* If 'Day Of Week' is selected as the permission, the block content will be shown on the specified days.

* If 'PHP Function' is selected as the permission, the block content will be shown according to the return value of the specified PHP function.

### Hide

* If 'Everyone' is selected as the permission, the block content will be hidden from everyone.

* If 'Members' is selected as the permission, the block content will be hidden from the logged in users.

* If 'Members with Selected User Roles' is selected as the permission, the block content will be hidden from the members with specified user roles.

* If 'Selected Users' is selected as the permission, the block content will be hidden from the specified users.

* If 'Selected Devices' is selected as the permission, the block content will be hidden from the specified devices, such as Desktops, Phones and/or Tablets.

* If 'Date Range' is selected as the permission, the block content will be hidden between the specified dates.

* If 'Time Range' is selected as the permission, the block content will be hidden between the specified times.

* If 'Day Of Week' is selected as the permission, the block content will be hidden on the specified days.

* If 'PHP Function' is selected as the permission, the block content will be hidden according to the return value of the specified PHP function.

## Build

Run `npm install` to install the npm dependencies.

For development, run `npm start`.

To get the release version, run `py .\release.py`. (Python v3.x is required.)

## License
[GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html) or later

Copyright 2018-2019 by meceware

## Credits
* Various React component creators
* [Mobile Detect](https://github.com/serbanghita/Mobile-Detect) by Serban Ghita
* [React Select](https://github.com/JedWatson/react-select) by Jed Watson
* [RC Date Time Picker](https://github.com/AllenWooooo/rc-datetime-picker) by Allen Wu

**[by meceware](https://www.meceware.com/)**
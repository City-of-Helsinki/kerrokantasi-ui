# Map Data

	parent -> iframe:
	{"message": "mapData",
	"data": {....},
	"instanceId": ....,
	"canComment": ....}

Host posts the configuration data to the plugin.
instanceId: an unique identifier for this map instance. A string. This is required to identify separate instances of the plugin in a single host page.
canComment: boolean. Tells the plugin whether it is allowed to post user data.

The `data` parameter contains the following keys:

* boundary: GeoJSON object describing the region where the user may add entities
* catalog: A catalog structure of entities available. (Schema TBD, @jyrki?)
* limit: a Number describing the total budget available for the user. May be null (to describe INFINITE BUDGET)
* existing: GeoJSON object describing currently existing features (such as trash cans and benches) that the user may comment on. May be null.

For visualization purposes, the following key _may_ or may not be present:

* comments: Array of objects, each with key 'pluginData' that contains GeoJSON posted with the comment.

# Get User Data

	parent -> iframe:
	{"message": "getUserData"}

Host requests that the plugin sends the full JSON of all user changes (when the user's changes should be persisted to the server)

# Post User Data

	iframe -> parent:
	{"message": "userData", "data": {....}, "instanceId": (the instance id)}

Plugin sends the full JSON of all user changes (when requested, never otherwise to save on CPU cycles)

# User Data Change Notification

	iframe -> parent:
	{"message": "userDataChanged", "instanceId": (the instance id)}

Plugin notifies that the user has done some significant changes in the UI, that might warrant an "are you sure you want to navigate away" message.
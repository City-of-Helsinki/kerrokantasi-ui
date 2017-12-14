# Map Data

	parent -> iframe:
	{"message": "mapData",
	"data": {....},
	"instanceId": ....,
	"pluginPurpose": ....,
	"defaultNickname:": ....,
	"comments": [....]}

Host posts the configuration data to the plugin.
instanceId: an unique identifier for this map instance. A string. This is required to identify separate instances of the plugin in a single host page.
pluginPurpose: `postComments`, `viewComments` or `viewHeatmap`, depending on which plugin feature we want displayed. The plugin is only allowed to post data if called with `postComments`.
defaultNickname: String containing the possible default nickname.
comments: Array of objects. Must be present if `pluginPurpose` contains `viewComments` or `viewHeatmap`.

The `data` object is always present and may contain the following keys:

* boundary: GeoJSON object describing the region where the user may add entities, if the area is limited. May be null or missing.
* catalog: A catalog structure of entities available, if the user may post entities. May be null or missing.
* limit: a Number describing the total budget available for the user, if there is a limit to posting. May be null or missing.
* existing: GeoJSON object describing currently existing features that the user may comment on. May be null or missing.

The `comments` objects contain the following keys:

* title: The title for the comment selected by the user. May be null.
* section: The section of the hearing the comment pertains to, for hearings with several sections. May not be posted by plugin.
* content: The comment text typed by the user. May be null.
* geojson: The geometry that the comment refers to. May be null, or any valid geojson object. May contain metadata such as id, if we wish to refer to known geometry objects.
* author_name: The name or nickname provided by the user. May be null.
* plugin_identifier: Identifies the plugin used to write the comment plugin data. Required if plugin_data is not null.
* plugin_data: Any additional data the plugin wishes to save with the comment. May be null.
* label: The api.hel.fi/kerrokantasi/v1/label object attached to the comment. May be null.
* n_votes: The number of votes the comment has been given. May not be posted by plugin.
* images: The api.hel.fi/kerrokantasi/v1/image objects attached to the comment. May be empty.

# Get User Data

	parent -> iframe:
	{"message": "getUserData"}

Host requests that the plugin sends the full JSON of all user changes (when the user's changes should be persisted to the server)

# Post User Data

	iframe -> parent:
	{"message": "userData",
	"comment": {....},
	"instanceId": (the instance id)}

Plugin sends the full JSON of the user data. Can be triggered by parent request, or the iframe wishing to post a comment. Results in the parent posting the data to the API.

For `comment` object contents, see mapData above.

# Post Vote

    iframe -> parent:
    {"message": "userVote",
    "commentId": (the comment id)}

Plugin requests parent to vote for the comment with provided id.

# User Data Change Notification

	iframe -> parent:
	{"message": "userDataChanged", "instanceId": (the instance id)}

Plugin notifies that the user has done some significant changes in the UI, that might warrant an "are you sure you want to navigate away" message.

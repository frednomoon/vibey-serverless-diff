## Steps

 - Input provides 2 optional parameters: identifier for previous state, user preferences.

 - (If a previous state is not provided we should assume this is the first request, and the full state can be sent (potentially large data request).)

 - (User preferences can be used to filter the data sent back, so if none are provided the full diff can be sent.)

 - When both are provided, the function will diff the previous state provided with the current state (cacheing this diff for future use), then filter this diff based on the users preferences.

 - The resulting update can be sent to the user.
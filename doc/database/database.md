## Users and Contacts

-- users: Stores information about each user of the chat application.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the user
    username VARCHAR(255) UNIQUE NOT NULL, -- Unique username for login/display
    email VARCHAR(255) UNIQUE NOT NULL, -- Unique email address for registration/recovery
    password TEXT NOT NULL, -- Hashed password (ensure proper hashing algorithm is used)
    profile_picture TEXT, -- URL to the user's profile picture
    status ENUM('online', 'offline', 'busy', 'away') DEFAULT 'offline', -- User's current online status
    created_at TIMESTAMPTZ DEFAULT NOW(), -- Timestamp of when the user account was created
    updated_at TIMESTAMPTZ DEFAULT NOW() -- Timestamp of the last update to the user's profile
);

-- contacts: Manages contact relationships between users.
CREATE TABLE contacts (
    user_id_1 UUID REFERENCES users(id) NOT NULL, -- The ID of the user who initiated/is part of the contact relationship
    user_id_2 UUID REFERENCES users(id) NOT NULL, -- The ID of the other user in the contact relationship
    status ENUM('pending', 'accepted', 'blocked') NOT NULL, -- The current status of the contact relationship
    created_at TIMESTAMPTZ DEFAULT NOW(), -- Timestamp of when the contact request was made
    PRIMARY KEY (user_id_1, user_id_2),
    -- Ensures consistent storage: always store the contact with the lexicographically smaller UUID first.
    -- This prevents duplicate entries like (userA, userB) and (userB, userA).
    CONSTRAINT chk_users_order CHECK (user_id_1 < user_id_2)
);

## Chat and Messaging System
-- conversations: A central hub for all types of conversations (one-to-one or group).
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the conversation
    type ENUM('one_to_one', 'group') NOT NULL, -- Specifies the type of conversation
    created_at TIMESTAMPTZ DEFAULT NOW(), -- Timestamp of when the conversation was initiated
    updated_at TIMESTAMPTZ DEFAULT NOW() -- Timestamp of the last activity in the conversation
);

-- conversation_participants: Links users to conversations.
CREATE TABLE conversation_participants (
    conversation_id UUID REFERENCES conversations(id) NOT NULL, -- The ID of the conversation
    user_id UUID REFERENCES users(id) NOT NULL, -- The ID of the participating user
    joined_at TIMESTAMPTZ DEFAULT NOW(), -- Timestamp of when the user joined the conversation
    PRIMARY KEY (conversation_id, user_id) -- Ensures a user can only participate once in a given conversation
);

-- messages: Stores individual messages sent by users within conversations.
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY, -- Unique, auto-incrementing identifier for the message
    conversation_id UUID REFERENCES conversations(id) NOT NULL, -- The conversation this message belongs to
    sender_id UUID REFERENCES users(id) NOT NULL, -- The user who sent the message
    content TEXT NOT NULL, -- The actual text content of the message
    created_at TIMESTAMPTZ DEFAULT NOW() -- Timestamp of when the message was sent
);

-- message_receipts: Tracks the status (sent, delivered, read) of messages for each recipient.
CREATE TABLE message_receipts (
    message_id BIGINT REFERENCES messages(id) NOT NULL, -- The ID of the message
    user_id UUID REFERENCES users(id) NOT NULL, -- The ID of the recipient user
    status ENUM('sent', 'delivered', 'read') NOT NULL, -- The receipt status of the message for that recipient
    updated_at TIMESTAMPTZ DEFAULT NOW(), -- Timestamp of the last status update
    PRIMARY KEY (message_id, user_id) -- Ensures a unique receipt status for each message/user pair
);

-- message_attachments: If your chat supports media or file attachments.
CREATE TABLE message_attachments (
    id BIGSERIAL PRIMARY KEY, -- Unique, auto-incrementing identifier for the attachment
    message_id BIGINT REFERENCES messages(id) NOT NULL, -- The message this attachment belongs to
    file_url TEXT NOT NULL, -- URL to the stored file
    file_type VARCHAR(50) NOT NULL, -- e.g., 'image/jpeg', 'video/mp4', 'application/pdf'
    created_at TIMESTAMPTZ DEFAULT NOW() -- Timestamp of when the attachment was added
);

-- message_reactions: If users can react to messages (e.g., like, emoji reactions).
CREATE TABLE message_reactions (
    id BIGSERIAL PRIMARY KEY, -- Unique, auto-incrementing identifier for the reaction
    message_id BIGINT REFERENCES messages(id) NOT NULL, -- The message that was reacted to
    user_id UUID REFERENCES users(id) NOT NULL, -- The user who added the reaction
    reaction_type VARCHAR(50) NOT NULL, -- The type of reaction (e.g., '👍', '❤️', '😂', or 'like', 'heart')
    created_at TIMESTAMPTZ DEFAULT NOW(), -- Timestamp of when the reaction was added
    UNIQUE (message_id, user_id, reaction_type) -- Ensures a user can only add one of each reaction type to a message
);

## Group-Specific Functionality
-- groups: Contains details specific to group conversations.
CREATE TABLE groups (
    conversation_id UUID PRIMARY KEY REFERENCES conversations(id) NOT NULL, -- Links to a conversation entry of type 'group'
    name VARCHAR(255) NOT NULL, -- The name of the group
    description TEXT, -- A brief description of the group
    group_icon_url TEXT, -- URL to the group's icon
    creator_id UUID REFERENCES users(id) NOT NULL -- The user who created the group
);

-- group_members: Defines which users are members of which groups and their roles.
CREATE TABLE group_members (
    conversation_id UUID REFERENCES groups(conversation_id) NOT NULL, -- The ID of the group conversation
    user_id UUID REFERENCES users(id) NOT NULL, -- The ID of the group member
    role ENUM('admin', 'member') DEFAULT 'member' NOT NULL, -- The role of the user within the group
    added_by UUID REFERENCES users(id), -- The user who added this member to the group (can be NULL if it's the creator)
    PRIMARY KEY (conversation_id, user_id) -- Ensures a user can only be a member once in a specific group
);

## Voice and Video Call System 📞📹
-- calls: Stores information about voice and video calls.
CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the call
    conversation_id UUID REFERENCES conversations(id) NOT NULL, -- The conversation in which the call was initiated
    type ENUM('voice', 'video') NOT NULL, -- The type of call
    status ENUM('initiated', 'ongoing', 'completed', 'missed') NOT NULL, -- The current status of the call
    started_at TIMESTAMPTZ DEFAULT NOW(), -- Timestamp of when the call began
    ended_at TIMESTAMPTZ -- Timestamp of when the call ended (NULL if ongoing)
);

-- call_participants: Tracks participants within each call.
CREATE TABLE call_participants (
    call_id UUID REFERENCES calls(id) NOT NULL, -- The ID of the call
    user_id UUID REFERENCES users(id) NOT NULL, -- The ID of the participant
    status ENUM('ringing', 'connected', 'declined', 'left') NOT NULL, -- The participant's status in the call
    joined_at TIMESTAMPTZ, -- Timestamp of when the participant joined the call
    left_at TIMESTAMPTZ, -- Timestamp of when the participant left the call (NULL if still connected)
    PRIMARY KEY (call_id, user_id) -- Ensures a user can only be a participant once in a specific call
);

-- screen_share_logs: Records details about screen sharing sessions within calls.
CREATE TABLE screen_share_logs (
    id BIGSERIAL PRIMARY KEY, -- Unique identifier for the screen share log entry
    call_id UUID REFERENCES calls(id) NOT NULL, -- The call during which screen sharing occurred
    sharer_user_id UUID REFERENCES users(id) NOT NULL, -- The user who was sharing their screen
    started_at TIMESTAMPTZ DEFAULT NOW(), -- Timestamp when screen sharing began
    ended_at TIMESTAMPTZ -- Timestamp when screen sharing ended (NULL if still ongoing or disconnected unexpectedly)
);




## users (This will store information about each user of the chat application.)

id,
username,
email,
password,
profile_picture,
status ENUM('online', 'offline', 'busy', 'away') DEFAULT 'offline',
created_at,
updated_at,

## contacts

user_id_1 UUID (Foreign Key to users.id) The ID of the user who initiated the contact request.
user_id_2 UUID (Foreign Key to users.id) The ID of the user who received the contact request.
status ENUM('pending', 'accepted', 'blocked') The current status of the contact relationship.
created_at TIMESTAMPZ Timestamp of when the contact request was made.
Primary Key (user_id_1, user_id_2)

## conversations

id UUID (Primary Key) Unique identifier for the conversation.
type ENUM('one_to_one', 'group') Specifies the type of conversation.
created_at TIMESTAMPZ Timestamp of when the conversation was initiated.
updated_at TIMESTAMPZ Timestamp of the last activity in the conversation.

## conversation_participants

conversation_id UUID (Foreign Key to conversations.id) The ID of the conversation.
user_id UUID (Foreign Key to users.id) The ID of the participating user.
joined_at TIMESTAMPZ Timestamp of when the user joined the conversation.
Primary Key (conversation_id, user_id)

## messages(Stores individual messages sent by users.)

id BIGSERIAL (Primary Key) Unique, auto-incrementing identifier for the message.
conversation_id UUID (Foreign Key to conversations.id) The conversation this message belongs to.
sender_id UUID (Foreign Key to users.id) The user who sent the message.
content TEXT The actual text content of the message.
status (sent, delivered, read)
created_at TIMESTAMPZ Timestamp of when the message was sent.

## message_receipts

message_id BIGINT (Foreign Key to messages.id) The ID of the message.
user_id UUID (Foreign Key to users.id) The ID of the recipient.
status ENUM('sent', 'delivered', 'read') The receipt status of the message.
updated_at TIMESTAMPZ Timestamp of the last status update.
Primary Key (message_id, user_id)

# contacts

user_id_1 UUID (Foreign Key to users.id) The ID of the user who initiated the contact request.
user_id_2 UUID (Foreign Key to users.id) The ID of the user who received the contact request.
status ENUM('pending', 'accepted', 'blocked') The current status of the contact relationship.
created_at TIMESTAMPZ Timestamp of when the contact request was made.
Primary Key (user_id_1, user_id_2)

Export to Sheets

## Chat and Messaging System

This section covers both one-on-one and group conversations.

conversations
This table is a central hub for all types of conversations.

Column Data Type Description
id UUID (Primary Key) Unique identifier for the conversation.
type ENUM('one_to_one', 'group') Specifies the type of conversation.
created_at TIMESTAMPZ Timestamp of when the conversation was initiated.
updated_at TIMESTAMPZ Timestamp of the last activity in the conversation.

Export to Sheets
conversation_participants
This table links users to conversations.

Column Data Type Description
conversation_id UUID (Foreign Key to conversations.id) The ID of the conversation.
user_id UUID (Foreign Key to users.id) The ID of the participating user.
joined_at TIMESTAMPZ Timestamp of when the user joined the conversation.
Primary Key (conversation_id, user_id)

Export to Sheets
messages
This table stores every message sent within any conversation.

Column Data Type Description
id BIGSERIAL (Primary Key) Unique, auto-incrementing identifier for the message.
conversation_id UUID (Foreign Key to conversations.id) The conversation this message belongs to.
sender_id UUID (Foreign Key to users.id) The user who sent the message.
content TEXT The actual text content of the message.
created_at TIMESTAMPZ Timestamp of when the message was sent.

## message_receipts

message_id BIGINT (Foreign Key to messages.id) The ID of the message.
user_id UUID (Foreign Key to users.id) The ID of the recipient.
status ENUM('sent', 'delivered', 'read') The receipt status of the message.
updated_at TIMESTAMPZ Timestamp of the last status update.
Primary Key (message_id, user_id)

## Group-Specific Functionality

## groups

conversation_id UUID (Primary Key, Foreign Key to conversations.id) Links to the corresponding conversation entry.
name VARCHAR(255) The name of the group.
description TEXT A brief description of the group.
group_icon_url TEXT URL to the group's icon.
creator_id UUID (Foreign Key to users.id) The user who created the group.

## group_members

conversation_id UUID (Foreign Key to conversations.id) The ID of the group conversation.
user_id UUID (Foreign Key to users.id) The ID of the group member.
role ENUM('admin', 'member') The role of the user within the group.
added_by UUID (Foreign Key to users.id) The user who added this member to the group.
Primary Key (conversation_id, user_id)

## Voice and Video Call System 📞📹

## calls

id UUID (Primary Key) Unique identifier for the call.
conversation_id UUID (Foreign Key to conversations.id) The conversation in which the call was initiated.
type ENUM('voice', 'video') The type of call.
status ENUM('initiated', 'ongoing', 'completed', 'missed') The current status of the call.
started_at TIMESTAMPZ Timestamp of when the call began.
ended_at TIMESTAMPZ Timestamp of when the call ended.

## call_participants

call_id UUID (Foreign Key to calls.id) The ID of the call.
user_id UUID (Foreign Key to users.id) The ID of the participant.
status ENUM('ringing', 'connected', 'declined', 'left') The participant's status in the call.
joined_at TIMESTAMPZ Timestamp of when the participant joined the call.
left_at TIMESTAMPZ Timestamp of when the participant left the call.
Primary Key (call_id, user_id)

## conversations(This table represents a conversation between two or more users.)

id,
conversation_name,
created_at,
updated_at,

## conversation_participants(For group chats, this table stores which users belong to which conversations.)

id,
conversation_id,
user_id,
joind_at,

## message_attachments(If your chat supports media or file attachments (images, videos, etc.).)

id,
message_id,
file_url,
file_type,
create_at,

## message_reaction(If users can react to messages (e.g., like, emoji reactions).)

id,
message_id,
user_id,
reactin_type,
created_at,

## Example Query:

# Fetch all messages in a conversation:

# sql query

`SELECT m.content, m.created_at, u.username
FROM messages m
JOIN users u ON m.sender_id = u.user_id
WHERE m.conversation_id = ?
ORDER BY m.created_at;`

boss this is my database design for as like whats app so have any update this design please provide me. and use this code 
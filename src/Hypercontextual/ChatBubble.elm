module ChatBubble exposing (..)

import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import UI


type Side
    = Left
    | Right


type alias ChatBubble msg =
    { content : Html msg
    , side : Side
    }


chatBubble_ : Side -> Html msg -> ChatBubble msg
chatBubble_ side content =
    { side = side, content = content }


chatBubble : Side -> String -> ChatBubble msg
chatBubble side content =
    { side = side, content = text content }


avatar : String -> Html msg
avatar initials =
    div [ class "avatar" ] [ text initials ]


view : ChatBubble msg -> Html msg
view bubble =
    let
        ( className, leftAvatar, rightAvatar ) =
            if bubble.side == Left then
                ( "chat-bubble chat-bubble_left", UI.nothing, UI.nothing )

            else
                ( "chat-bubble chat-bubble_right", UI.nothing, avatar "" )
    in
    div [ class "chat-bubble_row" ]
        [ leftAvatar
        , div [ class className ]
            [ bubble.content ]
        , rightAvatar
        ]

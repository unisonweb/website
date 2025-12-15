module ChatBubble exposing (..)

import Html exposing (Html, div, text)
import Html.Attributes exposing (class, classList)
import UI
import UI.Icon as Icon


type Side
    = Left
    | Right


type alias ChatBubble msg =
    { content : Html msg
    , side : Side
    , isSuccess : Bool
    }


chatBubble_ : Side -> Html msg -> ChatBubble msg
chatBubble_ side content =
    { side = side, content = content, isSuccess = False }


chatBubble : Side -> String -> ChatBubble msg
chatBubble side content =
    { side = side, content = text content, isSuccess = False }


success : ChatBubble msg -> ChatBubble msg
success bubble =
    { bubble | isSuccess = True }


when : Bool -> (ChatBubble msg -> ChatBubble msg) -> ChatBubble msg -> ChatBubble msg
when condition f tile_ =
    whenElse condition f identity tile_


whenElse :
    Bool
    -> (ChatBubble msg -> ChatBubble msg)
    -> (ChatBubble msg -> ChatBubble msg)
    -> ChatBubble msg
    -> ChatBubble msg
whenElse condition f g tile_ =
    if condition then
        f tile_

    else
        g tile_


whenNot : Bool -> (ChatBubble msg -> ChatBubble msg) -> ChatBubble msg -> ChatBubble msg
whenNot condition f tile_ =
    when (not condition) f tile_


avatar : String -> Html msg
avatar initials =
    div [ class "avatar" ] [ text initials ]


view : ChatBubble msg -> Html msg
view bubble =
    let
        successIcon =
            if bubble.isSuccess then
                div [ class "success-icon" ] [ Icon.view Icon.checkmark ]

            else
                UI.nothing

        className =
            classList
                [ ( "chat-bubble", True )
                , ( "success", bubble.isSuccess )
                , ( "chat-bubble_left", bubble.side == Left )
                , ( "chat-bubble_right", bubble.side == Right )
                ]

        rightAvatar =
            if bubble.side == Left then
                UI.nothing

            else
                avatar ""
    in
    div [ class "chat-bubble_row" ]
        [ div [ className ] [ successIcon, bubble.content ]
        , rightAvatar
        ]

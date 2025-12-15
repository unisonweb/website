module ChatDemo exposing
    ( ChatDemo
    , addLogEntry
    , chatDemo
    , lazyViewAgentBubble
    , lazyViewAgentBubble_
    , lazyViewUserBubble
    , view
    , viewAgentBubble
    , viewAgentBubble_
    , viewEntry
    , viewInstruction
    , viewLoading
    , viewUserBubble
    , withDemoClass
    , withInteraction
    , withLog
    )

import ChatBubble
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Html.Keyed as Keyed
import Html.Lazy as Lazy
import UI.StatusBanner as StatusBanner


type alias ChatDemo msg =
    { demoClass : String
    , log : List ( String, Html msg )
    , interaction : Html msg
    }



-- CREATE


chatDemo : ChatDemo msg
chatDemo =
    { demoClass = "demo"
    , log = []
    , interaction = div [] []
    }



-- MODIFY


withDemoClass : String -> ChatDemo msg -> ChatDemo msg
withDemoClass className demo =
    { demo | demoClass = className }


withLog : List ( String, Html msg ) -> ChatDemo msg -> ChatDemo msg
withLog log demo =
    { demo | log = log }


addLogEntry : String -> Html msg -> ChatDemo msg -> ChatDemo msg
addLogEntry key entry demo =
    { demo | log = demo.log ++ [ ( key, entry ) ] }


withInteraction : Html msg -> ChatDemo msg -> ChatDemo msg
withInteraction interaction demo =
    { demo | interaction = interaction }



-- VIEW


view : ChatDemo msg -> Html msg
view demo =
    div [ class demo.demoClass ]
        [ Keyed.node "div" [ class "log" ] demo.log
        , div [ class "interaction" ] [ demo.interaction ]
        ]



-- VIEW HELPERS


viewEntry : List (Html msg) -> Html msg
viewEntry content =
    div [ class "entry" ] content


viewUserBubble : Html msg -> Html msg
viewUserBubble content =
    viewEntry
        [ content
            |> ChatBubble.chatBubble_ ChatBubble.Right
            |> ChatBubble.view
        ]


viewAgentBubble : Html msg -> Html msg
viewAgentBubble content =
    viewAgentBubble_ False content


viewAgentBubble_ : Bool -> Html msg -> Html msg
viewAgentBubble_ isSuccess content =
    viewEntry
        [ content
            |> ChatBubble.chatBubble_ ChatBubble.Left
            |> ChatBubble.when isSuccess ChatBubble.success
            |> ChatBubble.view
        ]


viewLoading : String -> Html msg
viewLoading label =
    div [ class "loading" ] [ StatusBanner.working label ]


viewInstruction : String -> Html msg
viewInstruction instruction =
    div [ class "instruction" ] [ StatusBanner.info instruction ]



-- LAZY VIEW HELPERS


lazyViewUserBubble : String -> Html msg
lazyViewUserBubble message =
    Lazy.lazy lazyViewUserBubble_ message


lazyViewUserBubble_ : String -> Html msg
lazyViewUserBubble_ message =
    viewEntry
        [ text message
            |> ChatBubble.chatBubble_ ChatBubble.Right
            |> ChatBubble.view
        ]


lazyViewAgentBubble : String -> Html msg
lazyViewAgentBubble message =
    Lazy.lazy lazyViewAgentBubble__ message


lazyViewAgentBubble__ : String -> Html msg
lazyViewAgentBubble__ message =
    viewEntry
        [ text message
            |> ChatBubble.chatBubble_ ChatBubble.Left
            |> ChatBubble.view
        ]


lazyViewAgentBubble_ : Bool -> String -> Html msg
lazyViewAgentBubble_ isSuccess message =
    Lazy.lazy2 lazyViewAgentBubble___ isSuccess message


lazyViewAgentBubble___ : Bool -> String -> Html msg
lazyViewAgentBubble___ isSuccess message =
    viewEntry
        [ text message
            |> ChatBubble.chatBubble_ ChatBubble.Left
            |> ChatBubble.when isSuccess ChatBubble.success
            |> ChatBubble.view
        ]

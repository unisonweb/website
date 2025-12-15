module ChatDemo exposing
    ( ChatDemo
    , chatDemo
    , withDemoClass
    , withLog
    , addLogEntry
    , withInteraction
    , view
    , viewEntry
    , viewUserBubble
    , viewAgentBubble
    , viewLoading
    , viewInstruction
    )

import ChatBubble
import Html exposing (Html, div)
import Html.Attributes exposing (class)
import Html.Keyed as Keyed
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
        [ Keyed.node "div" [ class "log" ] (List.reverse demo.log)
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
    viewEntry
        [ content
            |> ChatBubble.chatBubble_ ChatBubble.Left
            |> ChatBubble.view
        ]


viewLoading : String -> Html msg
viewLoading label =
    div [ class "loading" ] [ StatusBanner.working label ]


viewInstruction : String -> Html msg
viewInstruction instruction =
    div [ class "instruction" ] [ StatusBanner.info instruction ]

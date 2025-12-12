module Option exposing (..)

import Html exposing (Html, div, h4, header, input)
import Html.Attributes exposing (checked, class, classList, type_)
import UI.Click as Click exposing (Click)
import UI.Icon as Icon


type alias Option msg =
    { title : String
    , badge : Maybe String
    , content : Html msg
    , hasRadio : Bool
    , isChecked : Bool
    , hasChevron : Bool
    , isSelected : Bool
    , isDisabled : Bool
    , isBare : Bool
    , click : Maybe (Click msg)
    }



-- CREATE


option : String -> Html msg -> Option msg
option title content =
    { title = title
    , badge = Nothing
    , content = content
    , hasRadio = False
    , isChecked = False
    , hasChevron = False
    , isSelected = False
    , isDisabled = False
    , isBare = False
    , click = Nothing
    }



-- MODIFY


when : Bool -> (Option msg -> Option msg) -> Option msg -> Option msg
when condition f btn =
    whenElse condition f identity btn


whenElse :
    Bool
    -> (Option msg -> Option msg)
    -> (Option msg -> Option msg)
    -> Option msg
    -> Option msg
whenElse condition f g btn =
    if condition then
        f btn

    else
        g btn


whenNot : Bool -> (Option msg -> Option msg) -> Option msg -> Option msg
whenNot condition f btn =
    when (not condition) f btn


withBadge : String -> Option msg -> Option msg
withBadge badge opt =
    { opt | badge = Just badge }


withRadio : Bool -> Option msg -> Option msg
withRadio isChecked opt =
    { opt | hasRadio = True, isChecked = isChecked }


withChevron : Option msg -> Option msg
withChevron opt =
    { opt | hasChevron = True }


onClick : msg -> Option msg -> Option msg
onClick msg opt =
    withClick (Click.onClick msg) opt


withClick : Click msg -> Option msg -> Option msg
withClick click opt =
    { opt | click = Just click }


selected : Option msg -> Option msg
selected opt =
    { opt | isSelected = True }


enabled : Option msg -> Option msg
enabled opt =
    { opt | isDisabled = False }


disabled : Option msg -> Option msg
disabled opt =
    { opt | isDisabled = True }


bare : Option msg -> Option msg
bare opt =
    { opt | isBare = True }



-- VIEW


view : Option msg -> Html msg
view opt =
    let
        optionClass =
            classList
                [ ( "option", True )
                , ( "selected", opt.isSelected )
                , ( "disabled", opt.isDisabled )
                , ( "bare", opt.isBare )
                ]

        headerContent =
            case opt.badge of
                Just badgeText ->
                    [ h4 [] [ Html.text opt.title ]
                    , div [ class "badge" ] [ Html.text badgeText ]
                    ]

                Nothing ->
                    [ h4 [] [ Html.text opt.title ] ]

        radioSection =
            if opt.hasRadio then
                [ div [ class "radio" ]
                    [ input [ type_ "radio", checked opt.isChecked ] [] ]
                ]

            else
                []

        chevronSection =
            if opt.hasChevron then
                [ div [ class "chevron" ] [ Icon.view Icon.chevronRight ] ]

            else
                []

        detailsSection =
            div [ class "option-details" ]
                [ header [] headerContent, opt.content ]

        innerContent =
            if opt.hasRadio then
                [ div [ class "option-row" ]
                    (radioSection ++ [ detailsSection ])
                ]

            else
                detailsSection :: chevronSection
    in
    case opt.click of
        Just click ->
            Click.view [ optionClass ] innerContent click

        Nothing ->
            div [ optionClass ] innerContent

module Tile exposing (..)

import Html exposing (Html, div, h4, header, input)
import Html.Attributes exposing (checked, class, classList, type_)
import UI
import UI.Click as Click exposing (Click)
import UI.Icon as Icon


type alias Tile msg =
    { title : String
    , badge : Maybe String
    , content : Html msg
    , hasRadio : Bool
    , hasCheckbox : Bool
    , isChecked : Bool
    , hasChevron : Bool
    , isFocused : Bool
    , isSelected : Bool
    , isDisabled : Bool
    , isBare : Bool
    , click : Maybe (Click msg)
    }



-- CREATE


tile : String -> Html msg -> Tile msg
tile title content =
    { title = title
    , badge = Nothing
    , content = content
    , hasRadio = False
    , hasCheckbox = False
    , isChecked = False
    , hasChevron = False
    , isFocused = False
    , isSelected = False
    , isDisabled = False
    , isBare = False
    , click = Nothing
    }



-- MODIFY


when : Bool -> (Tile msg -> Tile msg) -> Tile msg -> Tile msg
when condition f tile_ =
    whenElse condition f identity tile_


whenElse :
    Bool
    -> (Tile msg -> Tile msg)
    -> (Tile msg -> Tile msg)
    -> Tile msg
    -> Tile msg
whenElse condition f g tile_ =
    if condition then
        f tile_

    else
        g tile_


whenNot : Bool -> (Tile msg -> Tile msg) -> Tile msg -> Tile msg
whenNot condition f tile_ =
    when (not condition) f tile_


withBadge : String -> Tile msg -> Tile msg
withBadge badge tile_ =
    { tile_ | badge = Just badge }


withRadio : Bool -> Tile msg -> Tile msg
withRadio isChecked tile_ =
    { tile_ | hasRadio = True, isChecked = isChecked }


withCheckbox : Bool -> Tile msg -> Tile msg
withCheckbox isChecked tile_ =
    { tile_ | hasCheckbox = True, isChecked = isChecked }


withChevron : Tile msg -> Tile msg
withChevron tile_ =
    { tile_ | hasChevron = True }


onClick : msg -> Tile msg -> Tile msg
onClick msg tile_ =
    withClick (Click.onClick msg) tile_


withClick : Click msg -> Tile msg -> Tile msg
withClick click tile_ =
    { tile_ | click = Just click }


focus : Tile msg -> Tile msg
focus tile_ =
    { tile_ | isFocused = True }


select : Tile msg -> Tile msg
select tile_ =
    { tile_ | isSelected = True }


enabled : Tile msg -> Tile msg
enabled tile_ =
    { tile_ | isDisabled = False }


disabled : Tile msg -> Tile msg
disabled tile_ =
    { tile_ | isDisabled = True }


bare : Tile msg -> Tile msg
bare tile_ =
    { tile_ | isBare = True }



-- VIEW


view : Tile msg -> Html msg
view tile_ =
    let
        tileClass =
            classList
                [ ( "tile", True )
                , ( "focused", tile_.isFocused )
                , ( "selected", tile_.isSelected )
                , ( "disabled", tile_.isDisabled )
                , ( "bare", tile_.isBare )
                ]

        selectedIcon =
            if tile_.isSelected then
                div [ class "selected-icon" ] [ Icon.view Icon.checkmark ]

            else
                UI.nothing

        headerContent =
            case tile_.badge of
                Just badgeText ->
                    [ selectedIcon
                    , h4 [] [ Html.text tile_.title ]
                    , div [ class "badge" ] [ Html.text badgeText ]
                    ]

                Nothing ->
                    [ selectedIcon, h4 [] [ Html.text tile_.title ] ]

        radioSection =
            if tile_.hasRadio then
                [ div [ class "radio" ]
                    [ input [ type_ "radio", checked tile_.isChecked ] [] ]
                ]

            else
                []

        checkboxSection =
            if tile_.hasCheckbox then
                [ div [ class "checkbox" ]
                    [ input [ type_ "checkbox", checked tile_.isChecked ] [] ]
                ]

            else
                []

        chevronSection =
            if tile_.hasChevron then
                [ div [ class "chevron" ] [ Icon.view Icon.chevronRight ] ]

            else
                []

        detailsSection =
            div [ class "tile-details" ]
                [ header [] headerContent, tile_.content ]

        innerContent =
            if tile_.hasRadio then
                [ div [ class "tile-row" ]
                    (radioSection ++ [ detailsSection ])
                ]

            else if tile_.hasCheckbox then
                [ div [ class "tile-row" ]
                    (checkboxSection ++ [ detailsSection ])
                ]

            else
                detailsSection :: chevronSection
    in
    case tile_.click of
        Just click ->
            Click.view [ tileClass ] innerContent click

        Nothing ->
            div [ tileClass ] innerContent

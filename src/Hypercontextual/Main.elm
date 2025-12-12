module Main exposing (..)

import Browser
import ChatBubble
import Html exposing (Html, div, span, text)
import Html.Attributes exposing (class)
import Lib.Util exposing (delayMsg)
import Option
import UI.Button as Button
import UI.Divider as Divider
import UI.Icon as Icon
import UI.StatusBanner as StatusBanner



-- DATA


type alias Item =
    { name : String
    , details : String
    }


type alias Order =
    { id : String
    , items : List Item
    , price : String
    , status : String
    }


orders : List Order
orders =
    [ { id = "#1847"
      , items =
            [ { name = "Organic Cotton T-Shirt", details = "(Navy, M)" }
            , { name = "Denim Jacket", details = "(Light Wash, L)" }
            ]
      , price = "$127.99"
      , status = "Not yet shipped"
      }
    , { id = "#1923"
      , items =
            [ { name = "Merino Wool Sweater", details = "(Charcoal, S)" }
            ]
      , price = "$64.50"
      , status = "Shipped"
      }
    , { id = "#2041"
      , items =
            [ { name = "Leather Boots", details = "(Brown, 10)" }
            , { name = "Canvas Belt", details = "(Black)" }
            , { name = "Linen Button-Up Shirt", details = "(White, M)" }
            ]
      , price = "$213.75"
      , status = "Delivered"
      }
    , { id = "#2156"
      , items =
            [ { name = "Chino Pants", details = "(Khaki, 32x32)" }
            , { name = "Baseball Cap", details = "(Navy)" }
            ]
      , price = "$89.99"
      , status = "Delivered"
      }
    ]


type alias Address =
    { id : String
    , name : String
    , isDefault : Bool
    , phone : String
    , address : String
    }


addresses : List Address
addresses =
    [ { id = "software-eng-road"
      , name = "Margaret Hamilton"
      , isDefault = True
      , phone = "+1 (617) 123-1234"
      , address = "1 Software Engineering Rd, Cambridge, MA 02139, USA"
      }
    , { id = "apollo-guidance-st"
      , name = "Margaret Hamilton"
      , isDefault = False
      , phone = "+1 (617) 321-4321"
      , address = "11 Apollo Guidance St, Cambridge, MA 02139, USA"
      }
    ]



-- MODEL


type Step
    = AwaitingInput
    | LoadingOrders
    | RecentOrders
    | LoadingAddresses Order
    | ShippingAddresses Order Address
    | SavingAddress Order Address
    | AddressUpdated Order Address


type alias Model =
    { step : Step }


type alias Flags =
    ()


init : Flags -> ( Model, Cmd Msg )
init _ =
    ( { step = AwaitingInput }, Cmd.none )



-- UPDATE


type Msg
    = NoOp
    | RequestShowRecentOrders
    | ShowRecentOrders
    | SelectOrder Order
    | ShowAddresses
    | SelectAddress Address
    | SaveAddressSelection
    | AddressSaved
    | Restart


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        RequestShowRecentOrders ->
            ( { model | step = LoadingOrders }, delayMsg 1500 ShowRecentOrders )

        ShowRecentOrders ->
            ( { model | step = RecentOrders }, Cmd.none )

        SelectOrder order ->
            ( { model | step = LoadingAddresses order }, delayMsg 1500 ShowAddresses )

        ShowAddresses ->
            let
                address =
                    List.head addresses
            in
            case ( model.step, address ) of
                ( LoadingAddresses order, Just addr ) ->
                    ( { model
                        | step =
                            ShippingAddresses order addr
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        SelectAddress address ->
            case model.step of
                ShippingAddresses order _ ->
                    ( { model | step = ShippingAddresses order address }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        SaveAddressSelection ->
            case model.step of
                ShippingAddresses order address ->
                    ( { model | step = SavingAddress order address }, delayMsg 1500 AddressSaved )

                _ ->
                    ( model, Cmd.none )

        AddressSaved ->
            case model.step of
                SavingAddress order address ->
                    ( { model | step = AddressUpdated order address }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        Restart ->
            ( { step = AwaitingInput }, Cmd.none )



-- VIEW


dividerWithoutMargin : Html msg
dividerWithoutMargin =
    Divider.divider
        |> Divider.withoutMargin
        |> Divider.small
        |> Divider.view


divider : Html msg
divider =
    Divider.divider
        |> Divider.small
        |> Divider.view


viewItem : Item -> Html Msg
viewItem item =
    div [ class "item" ]
        [ span [ class "item-name" ] [ text item.name ]
        , span [ class "subdued item-details" ] [ text item.details ]
        ]


viewOrder : Order -> Html Msg
viewOrder order =
    let
        itemsContent =
            div [ class "items" ]
                (List.map viewItem order.items)

        isDisabled =
            order.status /= "Not yet shipped"
    in
    Option.option order.id itemsContent
        |> Option.withBadge order.status
        |> Option.when isDisabled Option.disabled
        |> Option.whenNot isDisabled (Option.onClick (SelectOrder order))
        |> Option.whenNot isDisabled Option.withChevron
        |> Option.view


viewAddress : String -> Address -> Html Msg
viewAddress selectedAddressId addr =
    let
        addressContent =
            div []
                [ div [ class "phone" ] [ text addr.phone ]
                , div [ class "address subdued" ] [ text addr.address ]
                ]

        isSelected =
            selectedAddressId == addr.id
    in
    Option.option addr.name addressContent
        |> Option.withRadio isSelected
        |> Option.when addr.isDefault (Option.withBadge "Default")
        |> Option.when isSelected Option.selected
        |> Option.onClick (SelectAddress addr)
        |> Option.view


viewSelectedAddress : Address -> Html Msg
viewSelectedAddress addr =
    let
        addressContent =
            div []
                [ div [ class "phone" ] [ text addr.phone ]
                , div [ class "address subdued" ] [ text addr.address ]
                ]
    in
    Option.option addr.name addressContent
        |> Option.bare
        |> Option.view
        |> viewUserBubble


viewAwaitingInput : Html Msg
viewAwaitingInput =
    div [ class "step_awaiting-input" ]
        [ div [ class "text-field" ] [ text "I need to change the address for my order" ]
        , Button.icon
            RequestShowRecentOrders
            Icon.arrowRight
            |> Button.emphasized
            |> Button.large
            |> Button.view
        ]


viewRequestRecentOrders : Html Msg
viewRequestRecentOrders =
    viewUserBubble (text "I need to change the address for my order")


viewRecentOrders : Html Msg
viewRecentOrders =
    viewEntry
        [ div [ class "options" ]
            (List.map viewOrder orders)
        ]


viewShippingAddresses : Address -> Html Msg
viewShippingAddresses address =
    viewEntry
        [ div [ class "options" ] (List.map (viewAddress address.id) addresses)
        , div [ class "actions" ]
            [ Button.button SaveAddressSelection "Save selection"
                |> Button.emphasized
                |> Button.view
            ]
        ]


viewAddressUpdated : Address -> Html Msg
viewAddressUpdated address =
    viewEntry
        [ viewSelectedAddress address
        ]


viewEntry : List (Html Msg) -> Html Msg
viewEntry content =
    div [ class "entry" ] content


viewUserBubble : Html Msg -> Html Msg
viewUserBubble content =
    viewEntry
        [ content
            |> ChatBubble.chatBubble_ ChatBubble.Right
            |> ChatBubble.view
        ]


viewAgentBubble : Html Msg -> Html Msg
viewAgentBubble content =
    viewEntry
        [ content
            |> ChatBubble.chatBubble_ ChatBubble.Left
            |> ChatBubble.view
        ]


viewLoading : String -> Html Msg
viewLoading label =
    div [ class "loading" ] [ StatusBanner.working label ]


viewSelectedOrder : Order -> Html Msg
viewSelectedOrder order =
    let
        itemsContent =
            div [ class "items" ]
                (List.map viewItem order.items)
    in
    Option.option order.id itemsContent
        |> Option.withBadge order.status
        |> Option.bare
        |> Option.view
        |> viewUserBubble


viewDisabledInteraction : Html msg
viewDisabledInteraction =
    div [] [ text "todo" ]


view : Model -> Html Msg
view model =
    let
        ( log, interaction ) =
            case model.step of
                AwaitingInput ->
                    ( [], viewAwaitingInput )

                LoadingOrders ->
                    ( [ viewRequestRecentOrders
                      ]
                    , viewLoading "Looking up orders..."
                    )

                RecentOrders ->
                    ( [ viewRequestRecentOrders
                      , viewAgentBubble (text "Select a recent order")
                      , viewRecentOrders
                      ]
                    , viewDisabledInteraction
                    )

                LoadingAddresses order ->
                    ( [ viewRequestRecentOrders
                      , viewAgentBubble (text "Select a recent order")
                      , viewSelectedOrder order
                      ]
                    , viewLoading "Fetching saved addresses..."
                    )

                ShippingAddresses order address ->
                    ( [ viewRequestRecentOrders
                      , viewAgentBubble (text "Select a recent order")
                      , viewSelectedOrder order
                      , viewAgentBubble (text "Select an address")
                      , viewShippingAddresses address
                      ]
                    , viewDisabledInteraction
                    )

                SavingAddress order address ->
                    ( [ viewRequestRecentOrders
                      , viewAgentBubble (text "Select a recent order")
                      , viewSelectedOrder order
                      , viewAgentBubble (text "Select an address")
                      , viewAddressUpdated address
                      ]
                    , viewLoading "Saving address selection"
                    )

                AddressUpdated order newAddress ->
                    ( [ viewRequestRecentOrders
                      , viewAgentBubble (text "Select a recent order")
                      , viewSelectedOrder order
                      , viewAgentBubble (text "Select an address")
                      , viewAddressUpdated newAddress
                      , viewAgentBubble (text ("Address successfully updated on order " ++ order.id))
                      ]
                    , div [ class "actions" ]
                        [ Button.button Restart "Restart"
                            |> Button.emphasized
                            |> Button.view
                        ]
                    )
    in
    div [ class "demo orders-demo" ]
        [ div [ class "log" ] (List.reverse log)
        , div [ class "interaction" ] [ interaction ]
        ]



-- MAIN


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = always Sub.none
        }

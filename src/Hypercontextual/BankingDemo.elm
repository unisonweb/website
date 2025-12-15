module BankingDemo exposing (..)

import ChatDemo
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Lib.Util exposing (delayMsg)
import Set exposing (Set)
import Tile
import UI.Button as Button
import UI.Icon as Icon



-- DATA


type alias Account =
    { id : String
    , name : String
    , balance : String
    , accountType : String
    }


accounts : List Account
accounts =
    [ { id = "personal-checking"
      , name = "Personal Checking"
      , balance = "$2,847.32"
      , accountType = "Checking"
      }
    , { id = "joint-checking"
      , name = "Joint Checking"
      , balance = "$5,124.67"
      , accountType = "Checking"
      }
    , { id = "savings"
      , name = "Savings Account"
      , balance = "$12,450.00"
      , accountType = "Savings"
      }
    ]


type alias ContactMethod =
    { id : String
    , methodType : String
    , value : String
    , isDefault : Bool
    }


contactMethods : List ContactMethod
contactMethods =
    [ { id = "email-primary"
      , methodType = "Email"
      , value = "margaret.hamilton@example.com"
      , isDefault = True
      }
    , { id = "sms-primary"
      , methodType = "SMS"
      , value = "+1 (617) 555-0123"
      , isDefault = True
      }
    ]



-- MODEL


type Step
    = AwaitingInput
    | LoadingAccounts
    | SelectingAccounts (Set String)
    | LoadingContactMethods (Set String)
    | SelectingNotificationMethods (Set String) (Set String)
    | SavingAlert (Set String) (Set String)
    | AlertCreated (Set String) (Set String)


type alias Model =
    { step : Step }


init : ( Model, Cmd Msg )
init =
    ( { step = AwaitingInput }, Cmd.none )



-- UPDATE


type Msg
    = NoOp
    | RequestShowAccounts
    | ShowAccounts
    | ToggleAccount String
    | ConfirmAccounts
    | ShowContactMethods
    | ToggleContactMethod String
    | ConfirmNotificationMethods
    | SaveAlert
    | AlertSaved
    | Restart


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        RequestShowAccounts ->
            ( { model | step = LoadingAccounts }, delayMsg 1500 ShowAccounts )

        ShowAccounts ->
            ( { model | step = SelectingAccounts Set.empty }, Cmd.none )

        ToggleAccount accountId ->
            case model.step of
                SelectingAccounts selected ->
                    let
                        newSelected =
                            if Set.member accountId selected then
                                Set.remove accountId selected

                            else
                                Set.insert accountId selected
                    in
                    ( { model | step = SelectingAccounts newSelected }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        ConfirmAccounts ->
            case model.step of
                SelectingAccounts selected ->
                    if Set.isEmpty selected then
                        ( model, Cmd.none )

                    else
                        ( { model | step = LoadingContactMethods selected }, delayMsg 1500 ShowContactMethods )

                _ ->
                    ( model, Cmd.none )

        ShowContactMethods ->
            case model.step of
                LoadingContactMethods selectedAccounts ->
                    ( { model | step = SelectingNotificationMethods selectedAccounts Set.empty }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        ToggleContactMethod methodId ->
            case model.step of
                SelectingNotificationMethods accounts_ selected ->
                    let
                        newSelected =
                            if Set.member methodId selected then
                                Set.remove methodId selected

                            else
                                Set.insert methodId selected
                    in
                    ( { model | step = SelectingNotificationMethods accounts_ newSelected }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        ConfirmNotificationMethods ->
            case model.step of
                SelectingNotificationMethods accounts_ selected ->
                    if Set.isEmpty selected then
                        ( model, Cmd.none )

                    else
                        ( { model | step = SavingAlert accounts_ selected }, delayMsg 1500 SaveAlert )

                _ ->
                    ( model, Cmd.none )

        SaveAlert ->
            case model.step of
                SavingAlert accounts_ methods ->
                    ( { model | step = AlertCreated accounts_ methods }, delayMsg 500 AlertSaved )

                _ ->
                    ( model, Cmd.none )

        AlertSaved ->
            ( model, Cmd.none )

        Restart ->
            ( { step = AwaitingInput }, Cmd.none )



-- VIEW


viewAccount : Set String -> Account -> Html Msg
viewAccount selectedIds account =
    let
        accountContent =
            div []
                [ div [ class "balance" ] [ text account.balance ]
                , div [ class "account-type subdued" ] [ text account.accountType ]
                ]

        isSelected =
            Set.member account.id selectedIds
    in
    Tile.tile account.name accountContent
        |> Tile.withCheckbox isSelected
        |> Tile.when isSelected Tile.focus
        |> Tile.onClick (ToggleAccount account.id)
        |> Tile.view


viewContactMethod : Set String -> ContactMethod -> Html Msg
viewContactMethod selectedIds method =
    let
        methodContent =
            div []
                [ div [ class "value" ] [ text method.value ]
                ]

        isSelected =
            Set.member method.id selectedIds
    in
    Tile.tile method.methodType methodContent
        |> Tile.withCheckbox isSelected
        |> Tile.when method.isDefault (Tile.withBadge "Default")
        |> Tile.when isSelected Tile.focus
        |> Tile.onClick (ToggleContactMethod method.id)
        |> Tile.view


viewSelectedAccounts : Set String -> Html Msg
viewSelectedAccounts selectedIds =
    let
        selectedAccounts =
            accounts
                |> List.filter (\a -> Set.member a.id selectedIds)

        viewSelectedAccount account =
            let
                accountContent =
                    div []
                        [ div [ class "balance" ] [ text account.balance ]
                        , div [ class "account-type subdued" ] [ text account.accountType ]
                        ]
            in
            Tile.tile account.name accountContent
                |> Tile.select
                |> Tile.disabled
                |> Tile.view
    in
    ChatDemo.viewEntry
        [ div [ class "options" ]
            (List.map viewSelectedAccount selectedAccounts)
        ]


viewSelectedMethods : Set String -> Html Msg
viewSelectedMethods selectedIds =
    let
        selectedMethods =
            contactMethods
                |> List.filter (\m -> Set.member m.id selectedIds)

        viewSelectedMethod method =
            let
                methodContent =
                    div []
                        [ div [ class "value" ] [ text method.value ]
                        ]
            in
            Tile.tile method.methodType methodContent
                |> Tile.select
                |> Tile.disabled
                |> Tile.view
    in
    ChatDemo.viewEntry
        [ div [ class "options" ]
            (List.map viewSelectedMethod selectedMethods)
        ]


viewAwaitingInput : Html Msg
viewAwaitingInput =
    div [ class "step_awaiting-input" ]
        [ div [ class "text-field" ] [ text "Add an alert if my balance drops below $1000" ]
        , Button.icon
            RequestShowAccounts
            Icon.arrowRight
            |> Button.emphasized
            |> Button.large
            |> Button.view
        ]


viewRequestAlert : Html Msg
viewRequestAlert =
    ChatDemo.lazyViewUserBubble "Add an alert if my balance drops below $1000"


viewAccountSelection : Set String -> Html Msg
viewAccountSelection selectedIds =
    let
        hasSelection =
            not (Set.isEmpty selectedIds)
    in
    ChatDemo.viewEntry
        [ ChatDemo.viewAgentBubble (text "Which account(s) would you like to monitor?")
        , div [ class "options" ] (List.map (viewAccount selectedIds) accounts)
        , div [ class "actions" ]
            [ Button.button ConfirmAccounts "Continue"
                |> Button.emphasized
                |> Button.when (not hasSelection) Button.disabled
                |> Button.view
            ]
        ]


viewNotificationMethodSelection : Set String -> Html Msg
viewNotificationMethodSelection selectedIds =
    let
        hasSelection =
            not (Set.isEmpty selectedIds)
    in
    ChatDemo.viewEntry
        [ ChatDemo.viewAgentBubble (text "How would you like to be notified?")
        , div [ class "options" ]
            (List.map (viewContactMethod selectedIds) contactMethods)
        , div [ class "actions" ]
            [ Button.button ConfirmNotificationMethods "Continue"
                |> Button.emphasized
                |> Button.when (not hasSelection) Button.disabled
                |> Button.view
            ]
        ]


viewAlertSummary : Set String -> Set String -> Html Msg
viewAlertSummary accountIds methodIds =
    let
        selectedAccounts =
            accounts
                |> List.filter (\a -> Set.member a.id accountIds)
                |> List.map .name
                |> String.join ", "

        selectedMethods =
            contactMethods
                |> List.filter (\m -> Set.member m.id methodIds)
                |> List.map .methodType
                |> String.join " and "

        summaryText =
            "Alert created: You'll receive " ++ selectedMethods ++ " notifications when " ++ selectedAccounts ++ " drops below $1,000.00"
    in
    ChatDemo.lazyViewAgentBubble_ True summaryText


view : Model -> Html Msg
view model =
    let
        demo =
            ChatDemo.chatDemo
                |> ChatDemo.withDemoClass "demo banking-demo"

        ( demo_, interaction ) =
            case model.step of
                AwaitingInput ->
                    ( demo, viewAwaitingInput )

                LoadingAccounts ->
                    ( demo
                        |> ChatDemo.addLogEntry "request-alert" viewRequestAlert
                    , ChatDemo.viewLoading "Looking up your accounts..."
                    )

                SelectingAccounts selectedIds ->
                    ( demo
                        |> ChatDemo.addLogEntry "request-alert" viewRequestAlert
                        |> ChatDemo.addLogEntry "account-selection" (viewAccountSelection selectedIds)
                    , ChatDemo.viewInstruction "Select one or more accounts above"
                    )

                LoadingContactMethods selectedAccounts ->
                    ( demo
                        |> ChatDemo.addLogEntry "request-alert" viewRequestAlert
                        |> ChatDemo.addLogEntry "agent-select-accounts" (ChatDemo.lazyViewAgentBubble "Which account(s) would you like to monitor?")
                        |> ChatDemo.addLogEntry "selected-accounts" (viewSelectedAccounts selectedAccounts)
                    , ChatDemo.viewLoading "Fetching contact information..."
                    )

                SelectingNotificationMethods accountIds selectedMethods ->
                    ( demo
                        |> ChatDemo.addLogEntry "request-alert" viewRequestAlert
                        |> ChatDemo.addLogEntry "agent-select-accounts" (ChatDemo.lazyViewAgentBubble "Which account(s) would you like to monitor?")
                        |> ChatDemo.addLogEntry "selected-accounts" (viewSelectedAccounts accountIds)
                        |> ChatDemo.addLogEntry "method-selection" (viewNotificationMethodSelection selectedMethods)
                    , ChatDemo.viewInstruction "Select one or more notification methods above"
                    )

                SavingAlert accountIds methodIds ->
                    ( demo
                        |> ChatDemo.addLogEntry "request-alert" viewRequestAlert
                        |> ChatDemo.addLogEntry "agent-select-accounts" (ChatDemo.lazyViewAgentBubble "Which account(s) would you like to monitor?")
                        |> ChatDemo.addLogEntry "selected-accounts" (viewSelectedAccounts accountIds)
                        |> ChatDemo.addLogEntry "agent-select-methods" (ChatDemo.lazyViewAgentBubble "How would you like to be notified?")
                        |> ChatDemo.addLogEntry "selected-methods" (viewSelectedMethods methodIds)
                    , ChatDemo.viewLoading "Creating alert..."
                    )

                AlertCreated accountIds methodIds ->
                    ( demo
                        |> ChatDemo.addLogEntry "request-alert" viewRequestAlert
                        |> ChatDemo.addLogEntry "agent-select-accounts" (ChatDemo.lazyViewAgentBubble "Which account(s) would you like to monitor?")
                        |> ChatDemo.addLogEntry "selected-accounts" (viewSelectedAccounts accountIds)
                        |> ChatDemo.addLogEntry "agent-select-methods" (ChatDemo.lazyViewAgentBubble "How would you like to be notified?")
                        |> ChatDemo.addLogEntry "selected-methods" (viewSelectedMethods methodIds)
                        |> ChatDemo.addLogEntry "alert-summary" (viewAlertSummary accountIds methodIds)
                    , div [ class "actions" ]
                        [ Button.button Restart "Restart"
                            |> Button.emphasized
                            |> Button.view
                        ]
                    )
    in
    demo_
        |> ChatDemo.withInteraction interaction
        |> ChatDemo.view

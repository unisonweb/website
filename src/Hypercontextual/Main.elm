module Main exposing (..)

import BankingDemo
import Browser
import Html exposing (Html)
import OrderDemo



-- FLAGS


type DemoType
    = OrderDemo
    | BankingDemo


type alias Flags =
    { demo : String }


parseDemo : String -> DemoType
parseDemo demo =
    case demo of
        "BankingDemo" ->
            BankingDemo

        _ ->
            OrderDemo



-- MODEL


type Model
    = OrderDemoModel OrderDemo.Model
    | BankingDemoModel BankingDemo.Model


init : Flags -> ( Model, Cmd Msg )
init flags =
    case parseDemo flags.demo of
        OrderDemo ->
            let
                ( orderModel, orderCmd ) =
                    OrderDemo.init
            in
            ( OrderDemoModel orderModel, Cmd.map OrderDemoMsg orderCmd )

        BankingDemo ->
            let
                ( bankingModel, bankingCmd ) =
                    BankingDemo.init
            in
            ( BankingDemoModel bankingModel, Cmd.map BankingDemoMsg bankingCmd )



-- UPDATE


type Msg
    = OrderDemoMsg OrderDemo.Msg
    | BankingDemoMsg BankingDemo.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model ) of
        ( OrderDemoMsg orderMsg, OrderDemoModel orderModel ) ->
            let
                ( newOrderModel, orderCmd ) =
                    OrderDemo.update orderMsg orderModel
            in
            ( OrderDemoModel newOrderModel, Cmd.map OrderDemoMsg orderCmd )

        ( BankingDemoMsg bankingMsg, BankingDemoModel bankingModel ) ->
            let
                ( newBankingModel, bankingCmd ) =
                    BankingDemo.update bankingMsg bankingModel
            in
            ( BankingDemoModel newBankingModel, Cmd.map BankingDemoMsg bankingCmd )

        _ ->
            ( model, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    case model of
        OrderDemoModel orderModel ->
            Html.map OrderDemoMsg (OrderDemo.view orderModel)

        BankingDemoModel bankingModel ->
            Html.map BankingDemoMsg (BankingDemo.view bankingModel)



-- MAIN


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = always Sub.none
        }

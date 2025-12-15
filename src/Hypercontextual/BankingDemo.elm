module BankingDemo exposing (..)

import Html exposing (Html, div, text)
import Html.Attributes exposing (class)



-- MODEL


type alias Model =
    { placeholder : String }


init : ( Model, Cmd Msg )
init =
    ( { placeholder = "Banking Demo Coming Soon" }, Cmd.none )



-- UPDATE


type Msg
    = NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    div [ class "demo banking-demo" ]
        [ div [ class "placeholder" ]
            [ text model.placeholder
            ]
        ]

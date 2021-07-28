module Main exposing (..)

import Browser
import Browser.Navigation as Nav
import Html exposing (div, text)
import Url exposing (Url)



-- MODEL


type alias Model =
    { navKey : Nav.Key
    , url : Url
    }


init : Url -> Nav.Key -> ( Model, Cmd Msg )
init url navKey =
    let
        model =
            { navKey = navKey
            , url = url
            }
    in
    ( model, Cmd.none )



-- UPDATE


type Msg
    = LinkClicked Browser.UrlRequest
    | UrlChanged Url


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> Browser.Document Msg
view model =
    { title = "hello world"
    , body =
        [ div [] [ text "hello world" ]
        ]
    }



-- MAIN


main : Program () Model Msg
main =
    Browser.application
        { init = \_ -> init
        , update = update
        , view = view
        , subscriptions = subscriptions
        , onUrlRequest = LinkClicked
        , onUrlChange = UrlChanged
        }

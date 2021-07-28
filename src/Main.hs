{-# LANGUAGE OverloadedStrings #-}

import Control.Monad.IO.Class (liftIO)
import Web.Scotty
import Text.Mustache
import Text.Mustache.Types (Pair, Value(String))
import Network.Wai.Middleware.Static (addBase, staticPolicy)
import Network.Wai.Middleware.RequestLogger (logStdoutDev)
import qualified Data.Text.Lazy as TL

main :: IO ()
main = scotty 3000 $ do
  middleware $ staticPolicy (addBase "./ui/dist")
  middleware logStdoutDev

  get "/" $ do
    html =<< render "index.html" [("title", String "Hello World!")]


render :: FilePath -> [Pair] -> ActionM TL.Text
render template value = do
  r <- liftIO $ automaticCompile ["./ui/dist"] template
  pure $ case r of
    Left err -> TL.pack $ show err
    Right tmpl -> TL.fromStrict $ substitute tmpl (object value)

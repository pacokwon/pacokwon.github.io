+++
title = "하스켈로 간단한 Lisp 만들기 - 파싱"
date = "2023-06-16"

[taxonomies]
tags=["haskell", "ko"]

[extra]
comment = true
+++

이번 포스트와 다음 포스트에서는 간단한 Lisp 인터프리터를 만들어보겠다. 재미와 학습을 위한 것이니 간단하게 하겠다.

## 목차

<!-- - [Lisp와 목표](#lisp와-목표) -->
<!-- - [인터프리터 구조](#인터프리터-구조) -->
<!-- - [파싱](#파싱) -->
<!--   - [AST 정의](#ast-정의) -->
<!--   - [Parser Combinator](#parser-combinator) -->
<!--   - [숫자 파싱](#숫자-파싱) -->
<!--   - [식별자 파싱](#식별자-파싱) -->

나머지 부분들은 2부에서 다루겠다!

## Lisp와 목표

Lisp는 단순한 문법과 확장성으로 인해 매니아층이 있는 언어이다. 문법은 S-Expression이라는 표현을 사용하는데, 괄호가 많은 것으로 악명이 높다. 요새 Lisp는 그 자체로 언어라기보다 언어의 family를 나타내는 말로 쓰이는 것 같다. Racket, Common Lisp, Clojure 등등이 이 family에 속한다고 볼 수 있고, 심지어는 이맥스에서도 Emacs Lisp라는 언어를 이용해 내부 configuration을 구성할 수 있게 되어 있다. 언어들마다 제공하는 primitive가 각각 다른데, 이번에는 아래 기능들을 구현해보도록 하겠다.

- 표현식 평가
- 변수 선언 (local, global)
- 함수 선언 및 호출

사용할 언어는 하스켈이다. 이럴 때라도 써보도록 하겠다!

우선 프로젝트를 생성하자. 프로젝트 이름은 `whisper`이다. 여기서 사용하는 툴은 [stack](https://docs.haskellstack.org/en/stable/)이다.

```bash
stack new whisper new-template
```

다음과 같이 파일이 있을 것이다.

```plaintext
app           LICENSE       README.md  src         stack.yaml.lock  whisper.cabal
CHANGELOG.md  package.yaml  Setup.hs   stack.yaml  test
```

실제 프로젝트의 코드는 `app`, `src` 디렉토리에 있으며, `src`는 코어한 라이브러리 함수들이 있고, `app`에는 라이브러리 함수를 잘 조합하여 하나의 실행 파일로 동작하도록 하는 파일이 있다.

이 프로젝트에서는 `ghc 9.2.7`을 사용하겠다. `stack.yaml`에 이를 다음과 같이 명시해준다.

```yaml
#...
resolver: lts-20.24
#...
```

## 인터프리터 구조

우리의 인터프리터는 읽기 - 파싱 - 평가 - 출력의 단계로 동작하게 할 것이다. 이 중 코어한 부분이 파싱과 평가인데, 이 두 단계를 차례로 부딪혀 보도록 하자.

## 파싱

코드를 작성하기 전에 필요한 패키지를 설치해야 한다. 이 프로젝트에서 사용할 패키지는 [`megaparsec`](https://hackage.haskell.org/package/megaparsec)이라는 parser combinator 라이브러리와, 효율적인 텍스트 처리를 위한 [`text`](https://hackage.haskell.org/package/text) 패키지이다.

`stack.yaml`에 이를 명시해준다.

```yaml
extra-deps:
  - megaparsec-9.4.0
  - text-2.0.2
```

또 `package.yaml`의 `dependencies` 부분에 다음과 같이 추가한다.

```yaml
dependencies:
  - base >= 4.7 && < 5
  - megaparsec >= 9.4 # NEW
  - text >= 2.0 # NEW
```

이제 `src/Parser.hs`에 파싱 코드를 작성해보자.

NOTE: `megaparsec`과 같은 parser combinator 라이브러리를 처음 써봐서 [이 공식 문서](https://markkarpov.com/tutorial/megaparsec.html)를 많이 참고했다.

먼저 우리의 `Parser` 타입을 만들어야 한다. 앞으로 만들게 되는 파서들은 이 타입을 가지게 될 것이다.

```haskell
-- src/Parser.hs
module Parser where

import Data.Void (Void)
import Text.Megaparsec (Parsec)
import Data.Text (Text)

type Parser = Parsec Void Text
```

여기서 `Void`는 파싱 에러의 타입을 뜻하고, `Text`는 입력 소스의 타입을 의미한다. 개발 과정을 단순화하기 위해 에러 타입은 `Void`로 두었다.

### AST 정의

가장 먼저 Syntax 트리를 정의하겠다. Syntax 트리는 코드를 파싱한 결과물을 나타내는데, 우선 하나의 S-Expression을 나타내는 타입을 다음과 같이 정의해볼 수 있다.

```haskell
-- src/Parser.hs
data Sexpr = Paren [Sexpr]
           | Number Int
           | Ident String
     deriving Show
```

Syntax 트리의 노드를 3가지로 간단하게 나타내 보았다. `Number Int`는 `3`과 같이 정수를 표현하고, `Ident String`은 `a`, `foo`와 같이 변수를 표현하며, 마지막으로 `Paren [Sexpr]`는 `(* a (+ 1 3))`와 같이 여러 개의 S-Expression을 괄호 사이에 담고 있는 형태를 나타낸다.

맨 밑줄에 있는 `deriving Show`는 자바로 치면 `toString` 메서드를 자동으로 만들어주는 것과 같다. 다음과 같이 `Sexpr` 타입의 variant를 직관적으로 출력하는 데 도움을 준다.

```haskell
main :: IO ()
main = do
    print $ Number 3 -- Output: Number 3
    print $ Ident "foo" -- Output: Ident "foo"
    print $ Paren [Ident "+", Number 1, Number 4] -- Output: Paren [Ident "+",Number 1,Number 4]
```

### Parser Combinator

[파서 콤비네이터](https://en.wikipedia.org/wiki/Parser_combinator)는 모나드를 응용하여 재귀하향 파서를 작성하는 방법의 일종이다. 이름이 나타내듯이, 작은 파서를 조합하여 하나의 커다란 파서를 만들기 용이하다.

예를 들어 `megaparsec`에서는 `char`이라는 기본 파서가 있는데 이는 인자로 제공된 문자를 파싱한다.

```haskell
-- Main.hs
{-# LANGUAGE OverloadedStrings #-}

import Text.Megaparsec
import Text.Megaparsec.Char
import Data.Void (Void)
import Data.Text (Text)

type Parser = Parsec Void Text

main :: IO ()
main = do
    parseTest (char 'a' :: Parser Char) "a" -- 'a'
    parseTest (char 'a' :: Parser Char) "b" -- ERROR: unexpected 'b', expecting 'a'
```

`string`이라는 파서도 있다. 이는 인자로 제공된 문자열을 파싱한다.

```haskell
-- Main.hs
{-# LANGUAGE OverloadedStrings #-}

import Text.Megaparsec
import Text.Megaparsec.Char
import Data.Void (Void)
import Data.Text (Text)

type Parser = Parsec Void Text

main :: IO ()
main = do
    parseTest (string "foo" :: Parser Text) "foo" -- "foo"
```

위 두 예시는 정규표현식으로도 표현이 가능한데, 균형 잡힌 괄호 문제와 같이 regex는 표현하지 못하는 것들도 파싱할 수 있다.

```haskell
data ParenExpr = Empty | Concat ParenExpr ParenExpr deriving Show

parenExprParser :: Parser ParenExpr
parenExprParser = between (char '(') (char ')') innerExpr <|> emptyExpr
  where
    innerExpr = do
      left <- parenExprParser
      right <- parenExprParser
      return $ Concat left right
    emptyExpr = return Empty

main :: IO ()
main = do
    parseTest parenExprParser "(())()" -- Concat (Concat Empty Empty) Empty "foo"
```

### 숫자 파싱

그럼 이제 `megaparsec`에서 제공해주는 기본 파서를 이용해 AST의 정수 부분을 파싱해보자.

```haskell
-- Main.hs
{-# LANGUAGE OverloadedStrings #-}

import Text.Megaparsec
import Data.Void (Void)
import Data.Text (Text)
import qualified Text.Megaparsec.Char.Lexer as L

type Parser = Parsec Void Text

main :: IO ()
main = parseTest (L.decimal :: Parser Int) "345" -- 345
```

보이는 것과 같이 `Text.Megaparsec.Char.Lexer`의 `decimal` 함수는 10진수 숫자를 파싱해준다. 이때 파싱한 결과는 `Parser Int` 타입인데, 우리가 원하는 것은 `Parser Sexpr` 이다.

어떻게 바꿀 수 있을까?

`Parser` 타입이 모나드라는 사실은 이럴 때 도움이 된다. 이미 모나드에 대해 알고 있는 것을 그대로 적용할 수 있기 때문이다. 모나드가 Functor라는 사실을 알고 있다면, `fmap` 함수를 이용해 내부의 타입을 다음과 같이 변환할 수 있다.

```haskell
parseTest (Number <$> L.decimal :: Parser Sexpr) "345"
```

따라서 우리의 `number` 함수는 다음과 같이 정의할 수 있다.

```haskell
-- src/Parser.hs

-- ...
number :: Parser Sexpr
number = Number <$> L.decimal
```

### 식별자 파싱

이제 조금 더 어려운 식별자를 파싱해보기 전에 식별자가 어떻게 생겼으면 좋겠는지 정의할 필요가 있다. PHP나 JS는 변수명이 `$`로 시작하는 것을 허용하지만, 파이썬은 허용하지 않는 것을 보았을 때, 식별자의 생김새는 정하기 나름이다.

Lisp 계열 언어는 식별자 명명에 꽤 관대한 편이다. 따라서 이렇게 규칙을 정하겠다.

1. 식별자는 알파벳, 숫자, 그리고 특정 특수기호로 이루어져 있다
2. 식별자의 길이는 1 이상이다.
3. 식별자는 숫자로 시작할 수 없다.

1번의 "특정 특수기호"는 ASCII 테이블 안의 특수기호 중 `!"#$%&'*+,-./:<=>?@^_~` 를 의미한다.

여기서 전략은 두 개의 작은 파서를 만드는 것이다. 파서 A는 첫번째 글자만을 위한 파서이다. 즉 알파벳과 기호를 인식하는 파서이다. 파서 B는 나머지 글자들을 위한 파서이다. 즉 알파벳, 기호, 숫자까지 인식할 수 있다. 그 뒤 파서 A와 B를 합치면 식별자 파서가 되는 것이다.

파서 A는 다음과 같이 만들 수 있다.

```haskell
import Text.Megaparsec ((<|>))
import Text.Megaparsec.Char (letterChar)

first :: Parser Char
first = letterChar <|> symbolChar
```

`<|>` 연산자의 사용을 볼 수 있는데, 이는 연산자 앞에 있는 파서가 실패하면 뒤에 있는 파서를 시도해보라는 뜻이다. 즉 `letterChar`이 인식하지 못하면, `symbolChar`이 시도를 해보는 것이다. 만약 `symbolChar` 까지 인식하지 못한다면 에러가 발생할 것이다.

`letterChar`은 `megaparsec`에서 가져왔으나, `symbolChar`은 없는 것을 볼 수 있는데, 이는 `megaparsec`에 있는 `symbolChar`이 위에서 정의한 기호들과 일치하지 않기 때문이다. 직접 `symbolChar`를 정의해보자.

```haskell
import Text.Megaparsec (satisfy)
import qualified Data.Set as Set

symbols :: Set.Set Char
symbols = Set.fromList "!\"#$%&'*+,-./:<=>?@^_~"

symbolChar :: Parser Char
symbolChar = satisfy (`Set.member` symbols)
```

위에선 `satisfy`라는 `megaparsec`의 함수를 사용했는데, 주어진 predicate 함수를 만족하는 문자만 인식하게 하는 것이다. 우리는 predicate로 연산자 집합에 있는 문자만 인식하는 함수를 건넸다.

이제 두 개의 작은 파서가 완성되었다. 이를 조합해 식별자 파서를 완성시켜보자.

```haskell
-- src/Parser.hs
import Text.Megaparsec ((<|>), many, satisfy)
import Text.Megaparsec.Char (letterChar, alphaNumChar)

symbols :: Set.Set Char
symbols = Set.fromList "!\"#$%&'*+,-./:<=>?@^_~"

symbolChar :: Parser Char
symbolChar = satisfy (`Set.member` symbols)

ident :: Parser Sexpr
ident = Ident <$> p
    where
        first = letterChar <|> symbolChar
        rest = many (alphaNumChar <|> symbolChar)
        p = (:) <$> first <*> rest
```

위 코드에서 눈여겨볼 점들은:

1. `many` 함수를 이용하여 "하나의 문자를 인식하는 파서"를 "0개 이상의 문자를 인식하는 파서"로 만들었다.
2. `(:)` 리스트 cons 연산자를 이용하기 위해 `fmap(<$>)`과 `<*>`를 사용했다. `fmap`은 모나드가 functor이기 때문에 가능하고, `<*>`은 모나드가 applicative이기도 하기 때문에 가능하다.

### 리스트 파싱

이제 마지막 variant인 `Paren`을 파싱해보자. 안에 여러 개의 S-Expression을 담고 있기 때문에 리스트라고 부르겠다. 리스트를 파싱하기 위해 그것의 특성을 먼저 살펴보자.

1. `(`으로 시작한다.
2. `)`으로 끝난다.
3. 사이에 1개 이상의 S-Expression이 공백으로 구분되어 있다

가장 어려운 부분은 3번이다. 우선 리스트 안에는 또다른 S-Expression이 있기 때문에 재귀호출이 필요해 보이고, 또 공백을 어떻게든 처리해야 한다. 방법은 다양하겠지만, **파싱이 끝난 이후에 발생하는 공백을 consume하고 무시하도록** 파서를 수정하도록 하자.

이를 돕도록 유틸리티 함수를 하나 만들겠다. 파서를 입력으로 받아, 해당 파서가 하는 일 + 뒤에 있는 공백을 무시하는 파서를 만들자.

```haskell
import Text.Megaparsec.Char (space)

lexeme :: Parser a -> Parser a
lexeme p = p <* space
```

이를 이용하여 기존 파서들을 수정하자. 위 함수를 사용하면 꽤 간단하다.

```haskell
number :: Parser Sexpr
number = Number <$> lexeme L.decimal

-- ...
ident :: Parser Sexpr
ident = Ident <$> lexeme p
    where
        first = letterChar <|> symbolChar
        rest = many (alphaNumChar <|> symbolChar)
        p = (:) <$> first <*> rest
```

이로써 이 파서들은 뒤에 있는 공백까지 무시하는 기능까지 추가되었다.

```haskell
main :: IO ()
main = do
    parseTest (liftA2 (,) number ident) "345 foobar" -- (Number 345,Ident "foobar")
```

두 파서를 연속으로 실행시켜도 공백을 무시하고 잘 파싱해준다.

이제 유용한 함수를 하나 더 소개하겠다. 바로 `many`와 `some`인데, `many p`는 파서 `p`를 0번 이상 실행시켜 그 결과를 돌려주고, `some p`는 파서 `p`를 1번 이상 실행시켜 그 결과를 돌려준다.

즉, `many number`는 공백으로 구분된 0개 이상의 연속된 숫자를 파싱할 수 있고, `some ident`는 공백으로 구분된 1개 이상의 연속된 식별자를 파싱할 수 있다.

리스트 안에는 1개 이상의 S-Expression이 필요하기 때문에 `some`을 쓰면 된다. 근데 어떤 파서를 1번 이상 실행하면 될까? 우선은 그것을 `sexpr`라 부르기로 하고 조금 이따 돌아와보자.

종합해 보아 `paren` 파서를 만들어 보자. `(`로 시작하고, `p`를 1번 이상 실행한 뒤, `)`로 끝나는 것이다.

```haskell
import Text.Megaparsec (some)
import Text.Megaparsec.Char (char)

paren :: Parser Sexpr
paren =
  lexeme
    ( do
        _ <- char '('
        ss <- some sexpr -- ERROR: Variable not in scope: sexpr
        _ <- char ')'
        return $ Paren ss
    )
```

에러가 날 것이지만 우선은 S-Expression을 종합적으로 파싱해주는 `sexpr`를 완성해보자. 이미 S-Expression의 variant는 모두 파싱할 수 있으니, 이를 조합만 하면 된다.

```haskell
sexpr :: Parser Sexpr
sexpr = paren <|> number <|> ident
```

잘 되는지 확인해보자!

```haskell
main :: IO ()
main = do
    parseTest sexpr "(+ 1 2 3)" -- Paren [Ident "+",Number 1,Number 2,Number 3]
    parseTest sexpr "(+ 1 (* foo spam) 4)" -- Paren [Ident "+",Number 1,Paren [Ident "*",Ident "foo",Ident "spam"],Number 4]
    parseTest sexpr "5" -- Number 5
    parseTest sexpr "foo" -- Ident "foo"
```

문제없이 잘 파싱이 된다면 지금까지 잘 따라온 것이다🎉🎉

NOTE: `paren`은 다음과 같이 간결하게 나타낼 수도 있다!

```haskell
paren :: Parser Sexpr
paren = Paren <$> lexeme (char '(' *> some sexpr <* char ')')
```

아래는 지금까지 작성한 파서 코드이다.

```haskell
-- src/Parser.hs
module Parser (Sexpr (..), number, ident, paren, sexpr) where

import Data.List.NonEmpty (NonEmpty (..))
import qualified Data.Set as Set
import Data.Text (Text)
import Data.Void (Void)
import Text.Megaparsec (ErrorItem (..), MonadParsec (token), Parsec, Stream (Token), many, satisfy, some, (<|>))
import Text.Megaparsec.Char (alphaNumChar, char, letterChar, space)
import qualified Text.Megaparsec.Char.Lexer as L

type Parser = Parsec Void Text

data Sexpr
  = Paren [Sexpr]
  | Number Int
  | Ident String
  deriving (Show)

lexeme :: Parser a -> Parser a
lexeme p = p <* space

number :: Parser Sexpr
number = Number <$> lexeme L.decimal

symbols :: Set.Set Char
symbols = Set.fromList "!\"#$%&'*+,-./:<=>?@^_~"

symbolChar :: Parser Char
symbolChar = satisfy (`Set.member` symbols)

ident :: Parser Sexpr
ident = Ident <$> lexeme p
  where
    first = letterChar <|> symbolChar
    rest = many (alphaNumChar <|> symbolChar)
    p = (:) <$> first <*> rest

paren :: Parser Sexpr
paren = Paren <$> lexeme (char '(' *> some sexpr <* char ')')

sexpr :: Parser Sexpr
sexpr = paren <|> number <|> ident
```

여기까지가 파싱이다. 다음 포스트에서는 평가 부분을 다루도록 하겠다.

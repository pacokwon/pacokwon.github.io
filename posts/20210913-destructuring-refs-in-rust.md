---
title: 'Destructuring & References in Rust'
tags:
  - rust
  - quicknote
  - en
---

While teaching myself some Rust, it was common to see some code that "looked like" it was destructuring references, like:

```rust
fn main() {
    let vec = vec![1, 2, 3];
    let mut iter = vec.into_iter();

    println!("Find 2 in vec: {:?}", iter.find(|&x| x == 2)); // Find 2 in vec: Some(2)
}
```

At first glance, the semantics were a little hard to predict. My curiosity all came down to this: does this copy the whole value? So I decided to write some code to make things clear.

```rust
#[derive(Debug,Clone,Copy)]
struct Foo {
    a: u32,
    b: u32,
}

fn main() {
    let mut x = Foo { a: 3, b: 4 };
    let &mut mut y = &mut x;        // destructure mutable reference, AND the variable is mutable
    y.a = 50;
    println!("{:?} {:?}", x, y);    // ??
}
```

### Output:

```bash
Foo { a: 3, b: 4 } Foo { a: 50, b: 4 }
```

A pretty minimal example here, but the syntax looks real weird. I actually had a hard time trying to express what I wanted to because of the syntax.

Once we try to mutate the struct's field, the output shows that only `y` is mutated. It shows us that it indeed copies the whole value.

What if we try to destructure something that does not implement the `Copy` trait, like a vector?

```rust
fn main() {
    let mut x = vec![1, 2, 3];
    let &mut mut y = &mut x;
    println!("{:?}", y);
}
```

### Output:

```bash
error[E0507]: cannot move out of a mutable reference
  --> src/main.rs:10:22
   |
10 |     let &mut mut y = &mut x;
   |         ----------   ^^^^^^
   |         |    |
   |         |    data moved here
   |         |    move occurs because `y` has type `Vec<i32>`, which does not implement the `Copy` trait
   |         help: consider removing the `&mut`: `mut y`

error: aborting due to previous error; 1 warning emitted
```

Pretty much the same example except that it's a vector, but the compiler complains for the exact reason why we tried this example in the first place. The destructure does not work because the `Vec` struct does not implement `Copy`. What I've understood from these examples, is that such destructuring is meant to be used on types that support cheap copying.

## References

- https://doc.rust-lang.org/rust-by-example/flow_control/match/destructuring/destructure_pointers.html

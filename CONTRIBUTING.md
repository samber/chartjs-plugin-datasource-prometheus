# Contributing

## 👷‍♂️ Build

```bash
npm run dev
```

```bash
docker run --rm -it -p 8080:80 -v `pwd`:/usr/share/nginx/html nginx

# Then open http://localhost:8080/example
```

Open ./example/index.html

⚠  Demo project cannot be opened without a webserver, because of CORS errors.

## ✅ Test

```bash
npm run test
```

## 🚀 Publish

Increment version number in `package.json`.

```bash
npm run build
npm publish
```

## Last thing...

Thanks for your contribution ;)

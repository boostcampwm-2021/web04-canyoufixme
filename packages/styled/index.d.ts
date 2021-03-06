interface Stringable {
  toString: () => string;
}
type Props = { [key: string]: unknown };
type StyledComponentArg<T> = Stringable | ((props: T) => Stringable);
type StyledComponent = <T>(
  strings: TemplateStringsArray,
  ...args: StyledComponentArg<Props & T>[]
) => React.FC<Props & T>;
type GeneralStyledComponent<T> = (
  strings: TemplateStringsArray,
  ...args: StyledComponentArg<T>[]
) => React.FC<T>;

interface IStyled {
  [name: string]: StyledComponent;
}
declare const styled: IStyled &
  (<T>(Base: React.FC<T>) => GeneralStyledComponent<T & Props>);

export = styled;

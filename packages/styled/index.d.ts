type Props = { [key: string]: string | number | React.ReactNode };
type StyledComponentArg<T> = number | string | ((props: T) => string);
type StyledComponent = <T>(
  strings: TemplateStringsArray,
  ...args: StyledComponentArg<T>[]
) => React.FC<Props>;
type GeneralStyledComponent<T> = (
  strings: TemplateStringsArray,
  ...args: StyledComponentArg<T>[]
) => React.FC<T>;

interface IStyled {
  [name: string]: StyledComponent;
}
declare const styled: IStyled &
  (<T>(Base: React.ReactNode) => GeneralStyledComponent<T>);

export = styled;

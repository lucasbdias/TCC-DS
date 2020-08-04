SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `mkt` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `mkt`;

CREATE TABLE `cliente` (
  `idcliente` int(11) NOT NULL,
  `nome` varchar(45) NOT NULL,
  `area_atuacao` varchar(45) NOT NULL,
  `email` varchar(60) NOT NULL,
  `senha` varchar(40) NOT NULL,
  `token` char(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `cliente` (`idcliente`, `nome`, `area_atuacao`, `email`, `senha`, `token`) VALUES
(8, 'Giovanni Guarnieri', 'engenharia', 'gfguarnieri@gmail.com', '6367c48dd193d56ea7b0baad25b19455e529f5ee', ''),
(9, 'Diogo Paulino', 'engenharia', 'diogo@gmail.com', '6367c48dd193d56ea7b0baad25b19455e529f5ee', ''),
(10, 'Felipe Roberto', 'joalheria', 'felipe@gmail.com', '6367c48dd193d56ea7b0baad25b19455e529f5ee', '');

CREATE TABLE `cupom` (
  `idcupons` int(11) NOT NULL,
  `titulo` varchar(40) NOT NULL,
  `codigo` char(6) NOT NULL,
  `data_criacao` date NOT NULL,
  `data_expdicao` date NOT NULL,
  `qtdCliques` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `cupom` (`idcupons`, `titulo`, `codigo`, `data_criacao`, `data_expdicao`, `qtdCliques`) VALUES
(5, '15descontoo', 'desc15', '2020-07-23', '2020-07-25', 0),
(6, '10desconto', 'desc10', '2020-07-23', '2020-07-27', 0),
(7, '5desconto', 'desc05', '2020-07-23', '2020-07-28', 0),
(8, '20desconto', 'desc20', '2020-07-23', '2020-07-30', 0);

CREATE TABLE `mensagem` (
  `idmensagem` int(11) NOT NULL,
  `fkcliente` int(11) NOT NULL,
  `msg` text NOT NULL,
  `stat` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `mensagem` (`idmensagem`, `fkcliente`, `msg`, `stat`) VALUES
(4, 8, '[{\"nome\":\"Giovanni Guarnieri\",\"msg\":\"\",\"horario\":\"07:10\"},{\"nome\":\"Giovanni Guarnieri\",\"msg\":\"Opa, blz?\",\"horario\":\"07:10\"},{\"nome\":\"Giovanni Guarnieri\",\"msg\":\"Eae Jovem\",\"horario\":\"07:11\"},{\"nome\":\"admin\",\"msg\":\"Opa, eae Giovanni\",\"horario\":\"07:12\"},{\"nome\":\"admin\",\"msg\":\"s\",\"horario\":\"07:13\"},{\"nome\":\"admin\",\"msg\":\"oi\",\"horario\":\"07:13\"},{\"nome\":\"Giovanni Guarnieri\",\"msg\":\"ooo\",\"horario\":\"07:13\"},{\"nome\":\"admin\",\"msg\":\"opa\",\"horario\":\"07:14\"}]', 0);

CREATE TABLE `post` (
  `idpost` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `img` char(40) NOT NULL,
  `descricao` text NOT NULL,
  `visualizacao` int(11) NOT NULL,
  `criador` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `post` (`idpost`, `nome`, `img`, `descricao`, `visualizacao`, `criador`) VALUES
(4, 'Impressão de Action Figures', '400_5f19debe37d5f.jpeg', 'O mercado de Action Figures é um mercado emergente para pessoas com Impressora 3d, aprenda como se destacar nesse mercado..', 1, 9),
(5, 'Impressão 3D com Ressina na Odontologia', '400_5f19dfa4bdc83.jpg', 'O principal setor que utiliza das impressoras 3D de resina é o Odontológico, veja como eles utilizam dessa ferramenta.', 1, 9),
(6, 'Moldes impressos para Joalheria', '400_5f19dff8f379f.jpg', 'Faça seus modelos de joias digitalmente e faça moldes impressos', 1, 9),
(7, 'Engenharia e a Impressão 3D', '400_5f1a48c700023.jpg', 'Para prototipagem rápida na área de engenharia a impressora é muito util', 1, 9);

CREATE TABLE `produto` (
  `idproduto` int(11) NOT NULL,
  `nome` varchar(45) NOT NULL,
  `img` char(40) NOT NULL,
  `descricao` text NOT NULL,
  `cor` varchar(30) NOT NULL,
  `peso` decimal(8,2) NOT NULL,
  `link_compra` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `produto` (`idproduto`, `nome`, `img`, `descricao`, `cor`, `peso`, `link_compra`) VALUES
(3, 'Resina priZma 3D - Flexivel - GM-400', '400_5f19dcab97a2b.jpg', 'A Resina Makertech Labs FLEXÍVEL GM-400 para Impressoras LCD UV KLD-1260, WANHAO D7 e outras impressoras LCD é indicada para confecção de Modelos Odontológicos para uso em laboratório. Possui cor rosa e é flexivel para simulação de gengivas em modelos de prótese dentária. Utilizada principalmente para simulação de perfis de emergência em implantes.', 'Rosa', '1000.00', 'https://www.makertechlabs.com.br/Resina-priZma-3D---Flexivel---GM-400~21~18~2~Resinas-por-tipo-de-Impressora~Resinas-para-Impressoras-LCD'),
(4, 'Resina priZma 3D - Jewelry - VM-350 ', '400_5f19dcfee7728.jpg', 'Resina VM-350 para impressoras DLP UV e lampadas de mercúrio. Indicada pra prototipagem geral e joalheria para vulcanização (não fundição)', 'Vermelho', '500.00', 'https://www.makertechlabs.com.br/Resina-priZma-3D---Jewelry---VM-350---Impressoras-DLP~5~2~2~Resinas-por-tipo-de-Impressora~Resinas-para-impressoras-DLP'),
(5, 'Resina priZma 3D Bio Splint - Placas ', '400_5f19dd6a656c5.jpg', 'Resina PriZma 3D BIO SPLINT indicada para confecção de splints e placas miorrelaxantes. ', 'Incolor', '500.00', 'https://www.makertechlabs.com.br/Resina-priZma-3D-Bio-Splint---Placas-miorrelaxantes~47~2~2~Resinas-por-tipo-de-Impressora~Resinas-para-impressoras-DLP'),
(6, 'Resina priZma 3D Castable - CM-450 - Fundição', '400_5f19dda418ab4.jpg', 'A Resina Makertech Labs CM-450 CASTING para Impressoras DLP e LCD UV é indicada para fundição e injeção. Pode ser usada para Metais e Dissilicato de Lítio. Não indicadas para PPR.\r\nCompativel LCD/DLP', 'Laranja', '1000.00', 'https://www.makertechlabs.com.br/Resina-priZma-3D-Castable---CM-450---Fundicao-Casting---Impressoras-LCD-DLP~34~26~3~Resinas-por-Impressora~Anycubic---GTMax---Wanhao-D7'),
(7, 'Resina priZma 3D - Model - DM-450', '400_5f19ddf674dfe.jpg', 'A resina priZma 3D - Model - DM450 é indicada para confecção de modelos odontológicos (uso somente externo) e prototipagem geral.\r\nIndicada para impressoras LCD. ', 'Bege', '500.00', 'https://www.makertechlabs.com.br/Resina-priZma-3D---Model---DM-450~32~0~2~Resinas-por-tipo-de-Impressora~Resinas-por-tipo-de-Impressora'),
(8, 'PRIZMA 3D Colors - Corantes', '400_5f1a494b4699e.jpg', 'Corantes PRIZMA 3D Colors para uso em resinas para impressão 3D. Melhores resultados quando usadas em resinas transparentes e brancas. Cores CMYK - Azul, Amarelo, Preto, Magenta e também na cor Branca (pigmento)', 'CMYK', '50.00', 'https://www.makertechlabs.com.br/PRIZMA-3D-Colors---Corantes-CMYK-e-Pigmento-Branco~43~28~9~Corantes-e-Pigmentos~Corantes');

CREATE TABLE `usuariodb` (
  `iduser` int(11) NOT NULL,
  `nome` varchar(45) NOT NULL,
  `cargo` varchar(50) NOT NULL,
  `email` varchar(60) NOT NULL,
  `senha` varchar(40) NOT NULL,
  `token` char(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `usuariodb` (`iduser`, `nome`, `cargo`, `email`, `senha`, `token`) VALUES
(9, 'Lucas Braz', 'admin', 'lucas@gmail.com', 'abc123', ''),
(10, 'João Neto', 'admin', 'joao@gmail.com', 'abc123', ''),
(11, 'Eduardo Neto', 'admin', 'eduardo@gmail.com', 'abc123', NULL),
(12, 'Kelly Fernanda', 'admin', 'kelly@gmail.com', 'abc123', NULL);


ALTER TABLE `cliente`
  ADD PRIMARY KEY (`idcliente`);

ALTER TABLE `cupom`
  ADD PRIMARY KEY (`idcupons`);

ALTER TABLE `mensagem`
  ADD PRIMARY KEY (`idmensagem`),
  ADD KEY `fkcliente` (`fkcliente`);

ALTER TABLE `post`
  ADD PRIMARY KEY (`idpost`),
  ADD KEY `criador` (`criador`);

ALTER TABLE `produto`
  ADD PRIMARY KEY (`idproduto`);

ALTER TABLE `usuariodb`
  ADD PRIMARY KEY (`iduser`);


ALTER TABLE `cliente`
  MODIFY `idcliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

ALTER TABLE `cupom`
  MODIFY `idcupons` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `mensagem`
  MODIFY `idmensagem` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `post`
  MODIFY `idpost` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `produto`
  MODIFY `idproduto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `usuariodb`
  MODIFY `iduser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;


ALTER TABLE `mensagem`
  ADD CONSTRAINT `mensagem_ibfk_2` FOREIGN KEY (`fkcliente`) REFERENCES `cliente` (`idcliente`);

ALTER TABLE `post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`criador`) REFERENCES `usuariodb` (`iduser`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
